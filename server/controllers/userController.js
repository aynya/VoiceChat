const db = require('../config/dbConfig');

// 获取房间内所有用户
exports.getUsersInRoom = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE room_id = ?', [roomId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

// 添加用户到房间
exports.addUserToRoom = async (req, res) => {
  const body = req.body;
  const roomId = req.params.roomId;
  const { id, username, avatar } = body;

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: '您的账号已在别处使用' });
    }

    await db.query('INSERT INTO users (id, username, avatar, room_id) VALUES (?, ?, ?, ?)', [id, username, avatar, roomId]);
    res.json({ id, username, avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

// 删除用户从房间
exports.removeUserFromRoom = async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;

  try {
    await db.query('DELETE FROM users WHERE id = ? AND room_id = ?', [userId, roomId]);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};