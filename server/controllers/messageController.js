const db = require('../config/dbConfig');

// 获取房间内的所有消息
exports.getMessagesInRoom = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const [rows] = await db.query('SELECT * FROM messages WHERE room_id = ?', [roomId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

// 发送消息
exports.sendMessage = async (req, res) => {
  const body = req.body;
  const roomId = req.params.roomId;
  const { type, username, avatar, content, timestamp } = body;

  try {
    const [result] = await db.query(
      'INSERT INTO messages (type, username, avatar, content, timestamp, room_id) VALUES (?, ?, ?, ?, ?, ?)',
      [type, username, avatar, content, timestamp, roomId]
    );
    res.json({ id: result.insertId, ...body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};