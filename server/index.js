require('dotenv').config(); // 加载环境变量

const express = require('express');
const http = require('http');
const app = express();
const socketIo = require("socket.io");
const db = require('./config/dbConfig');
const corsMiddleware = require('./middleware/corsMiddleware');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const server = http.createServer(app);

// 使用无限制的 CORS 配置
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

// 收保护路由
app.use('/api/rooms', authMiddleware, roomRoutes);
app.use('/api/rooms', authMiddleware, userRoutes);
app.use('/api/rooms', authMiddleware, messageRoutes);

let usersMap = new Map();

// 使用有限制的 CORS 配置
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log(`用户 ${socket.id} 已连接`);
  socket.emit('myId', socket.id); 
  console.log('发送ID', socket.id)

  socket.on('join-room', (roomId, user) => {
    socket.join(roomId); 
    socket.roomId = roomId; 
    usersMap.set(socket.id, user);
    const roomUsers = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(id => (usersMap.get(id)))
    socket.emit('room-users', { roomId, users: roomUsers });
    socket.emit('myId', socket.id); 
    console.log(`用户 ${socket.id} 加入房间 ${roomId}`);
    console.log(`${roomId}房间中有 ${io.sockets.adapter.rooms.get(roomId).size} 个成员`);
    socket.to(roomId).emit('user-connected', user);
  });

  socket.on('leave-room', (roomId) => {
    usersMap.delete(socket.id);
    if (socket.roomId) {
      console.log(`用户 ${socket.id} 离开房间 ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit('user-disconnected', socket.id);
    }
  });

  socket.on('signal', ({ targetId, signal }) => {
    socket.to(targetId).emit('signal', { senderId: socket.id, signal });
  });

  socket.on('chat message', (msg) => {
    console.log('收到消息：', msg);
    io.to(socket.roomId).emit('chat message', msg);
  });

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
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`服务端运行在:${PORT}`);
});