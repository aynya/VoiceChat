const express = require('express');
const http = require('http');
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const server = http.createServer(app)

// 引入 MySQL 模块
const mysql = require('mysql2/promise');

// 创建数据库连接池
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '540819228', // 替换为你的数据库密码
  database: 'voice_chat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors())
app.use(express.json())

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

let usersMap = new Map();

io.on('connection', (socket) => {
  console.log(`用户 ${socket.id} 已连接`);
  socket.emit('myId', socket.id); // 发送自己的ID
  console.log('发送ID', socket.id)

  // 加入房间
  socket.on('join-room', (roomId, user) => {
    socket.join(roomId); // 加入指定房间
    socket.roomId = roomId; // 存储房间号
    usersMap.set(socket.id, user);
    const roomUsers = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(id => (usersMap.get(id)))
    // 发送房间中的用户列表给当前用户
    socket.emit('room-users', { roomId, users: roomUsers });
    socket.emit('myId', socket.id); // 发送自己的ID
    console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
    console.log(`${roomId}房间中有 ${io.sockets.adapter.rooms.get(roomId).size} 个成员`);
    // 通知房间内其他用户有新成员加入
    socket.to(roomId).emit('user-connected', user);
  });

  // 用户离开房间
  socket.on('leave-room', (roomId) => {
    console.log(roomId)
    usersMap.delete(socket.id);
    if (socket.roomId) {
      console.log(`用户 ${socket.id} 离开房间 ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit('user-disconnected', socket.id);
    }
  });

  // 转发WebRTC信令给房间内其他用户
  socket.on('signal', ({ targetId, signal }) => {
    socket.to(targetId).emit('signal', { senderId: socket.id, signal });
  });

  // 广播文字消息到房间
  socket.on('chat message', (msg) => {
    console.log('收到消息：', msg);
    io.to(socket.roomId).emit('chat message', msg);
  });

  // 用户断开时通知房间
  socket.on('disconnect', async () => {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [socket.id]);
      if (usersMap.has(socket.id)) {
        usersMap.delete(socket.id);
      }
      if (socket.roomId) {
        console.log(`用户 ${socket.id} 已断开连接`);
        socket.to(socket.roomId).emit('user-disconnected', socket.id);
      }
    } catch (error) {
      console.error(error);
    }
  });
});

app.get('/', (request, response) => {
  response.send(`<h1>hello<h1>`)
})

// 获取所有房间
app.get('/api/rooms', async (request, response) => {
  try {
    // 1. 删除用户数为 0 的房间及其相关聊天记录
    await db.query(`
      DELETE FROM messages
      WHERE room_id IN (
        SELECT id
        FROM rooms
        WHERE NOT EXISTS (
          SELECT 1
          FROM users
          WHERE users.room_id = rooms.id
        )
      )
    `);

    await db.query(`
      DELETE FROM rooms
      WHERE NOT EXISTS (
        SELECT 1
        FROM users
        WHERE users.room_id = rooms.id
      )
    `);

    // 2. 查询并返回剩余的房间列表
    const [rows] = await db.query('SELECT * FROM rooms');
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 获取对应房间的用户
app.get(`/api/rooms/:roomId/users`, async (request, response) => {
  const roomId = request.params.roomId;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE room_id = ?', [roomId]);
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 用户加入房间
app.post(`/api/rooms/:roomId/users`, async (request, response) => {
  const body = request.body;
  const roomId = request.params.roomId;
  const { id, username, avatar } = body;

  try {

    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (existingUsers.length > 0) {
      // 如果存在同名用户，返回错误提示
      return response.status(409).json({ error: '您的账号已在别处使用' });
    }

    await db.query('INSERT INTO users (id, username, avatar, room_id) VALUES (?, ?, ?, ?)', [id, username, avatar, roomId]);
    response.json({ id, username, avatar });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 用户退出房间
app.delete(`/api/rooms/:roomId/users/:userId`, async (request, response) => {
  const roomId = request.params.roomId;
  const userId = request.params.userId;

  try {
    await db.query('DELETE FROM users WHERE id = ? AND room_id = ?', [userId, roomId]);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 获取对应房间的消息
app.get(`/api/rooms/:roomId/messages`, async (request, response) => {
  const roomId = request.params.roomId;

  try {
    const [rows] = await db.query('SELECT * FROM messages WHERE room_id = ?', [roomId]);
    response.json(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 发送消息
app.post(`/api/rooms/:roomId/messages`, async (request, response) => {
  const body = request.body;
  const roomId = request.params.roomId;
  const { type, username, avatar, content, timestamp } = body;

  try {
    const [result] = await db.query(
      'INSERT INTO messages (type, username, avatar, content, timestamp, room_id) VALUES (?, ?, ?, ?, ?, ?)',
      [type, username, avatar, content, timestamp, roomId]
    );
    response.json({ id: result.insertId, ...body });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

// 创建房间
app.post(`/api/rooms`, async (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: 'content missing' });
  }

  const { label, type, id, uid } = body;

  try {
    const [result] = await db.query('INSERT INTO rooms (label, type, id, uid) VALUES (?, ?, ?, ?)', [label, type, id, uid]);
    response.json({ id: result.insertId, ...body });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
});

app.get(`/api/rooms/:roomId`, async (request, response) => {
  const roomId = request.params.roomId;
  try {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    if (rows.length === 0) {
      return response.status(404).json({
        error: 'room not found'
      });
    }
    response.json(rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Database error' });
  }
})


// 用户注册
app.post('/api/register', async (request, response) => {
  const { nickname, password, confirmPassword, avatarUrl } = request.body;
  console.log(nickname, password, confirmPassword, avatarUrl)
  // 验证输入
  if (!nickname || !password || !confirmPassword) {
    return response.status(400).json({ error: '所有字段都是必填的！' });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ error: '两次输入的密码不一致！' });
  }

  try {
    // 检查昵称是否已存在
    const [existingUsers] = await db.query('SELECT * FROM rgtUsers WHERE nickname = ?', [nickname]);
    if (existingUsers.length > 0) {
      return response.status(400).json({ error: '昵称已被占用！' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    await db.query(
      'INSERT INTO rgtUsers (nickname, password, avatar_url) VALUES (?, ?, ?)',
      [nickname, hashedPassword, avatarUrl]
    );

    response.json({ success: true, message: '注册成功！' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: '注册失败，请稍后再试！' });
  }
});


// 用户登录
app.post('/api/login', async (request, response) => {
  const { nickname, password } = request.body;

  // 验证输入
  if (!nickname || !password) {
    return response.status(400).json({ error: '用户名和密码是必填的！' });
  }

  try {
    // 查询用户是否存在
    const [users] = await db.query('SELECT * FROM rgtUsers WHERE nickname = ?', [nickname]);
    if (users.length === 0) {
      return response.status(400).json({ error: '用户不存在！' });
    }

    const user = users[0];

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(400).json({ error: '密码错误！' });
    }

    // 生成 JWT Token
    const token = jwt.sign({ userId: user.id, nickname: user.nickname }, 'your-secret-key', { expiresIn: '1h' });

    response.json({
      success: true,
      token,
      user: { nickname: user.nickname, avatarUrl: user.avatar_url },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: '登录失败，请稍后再试！' });
  }
});


const PORT = 3001
server.listen(PORT, () => {
  console.log('服务端运行在:3001');
});