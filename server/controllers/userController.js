const db = require('../config/dbConfig');
const tokenUtils = require('../utils/tokenUtils');
const config = require('../config/indexConfig');

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


    // 刷新 refreshToken 的持续时间
    const refreshTokenFromCookie = req.cookies.refreshToken;
    if (refreshTokenFromCookie) {
        try {
            const decoded = tokenUtils.verifyRefreshToken(refreshTokenFromCookie);
            if (decoded) {
                const payload = { userId: decoded.userId, nickname: decoded.nickname };
                const newRefreshToken = tokenUtils.generateRefreshToken(payload);

                const jwtExpiryInSeconds = parseInt(config.jwtRefreshTokenExpiry);
                const cookieMaxAge = jwtExpiryInSeconds * 1000; // 转换为毫秒

                // 设置新的 HttpOnly Cookie
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
                    path: '/',
                    maxAge: cookieMaxAge,
                });

                console.log('刷新了 refreshToken 的持续时间');
            }
        } catch (error) {
            console.error('刷新 refreshToken 失败:', error);
        }
    }

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