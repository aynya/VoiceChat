const db = require('../config/dbConfig');

// 获取所有房间
exports.getRooms = async (req, res) => {
  try {
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

    const [rows] = await db.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

// 获取单个房间
exports.getRoomById = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'room not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

// 创建房间
exports.createRoom = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({ error: 'content missing' });
  }

  const { label, type, id, uid } = body;

  try {
    const [result] = await db.query('INSERT INTO rooms (label, type, id, uid) VALUES (?, ?, ?, ?)', [label, type, id, uid]);
    res.json({ id: result.insertId, ...body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};