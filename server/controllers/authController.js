const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');

exports.register = async (req, res) => {
  const { nickname, password, confirmPassword, avatarUrl } = req.body;

  if (!nickname || !password || !confirmPassword) {
    return res.status(400).json({ error: '所有字段都是必填的！' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: '两次输入的密码不一致！' });
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM rgtUsers WHERE nickname = ?', [nickname]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '昵称已被占用！' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO rgtUsers (nickname, password, avatar_url) VALUES (?, ?, ?)',
      [nickname, hashedPassword, avatarUrl]
    );

    res.json({ success: true, message: '注册成功！' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '注册失败，请稍后再试！' });
  }
};

exports.login = async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: '用户名和密码是必填的！' });
  }

  try {
    const [users] = await db.query('SELECT * FROM rgtUsers WHERE nickname = ?', [nickname]);
    if (users.length === 0) {
      return res.status(400).json({ error: '用户不存在！' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '密码错误！' });
    }

    const token = jwt.sign({ userId: user.id, nickname: user.nickname }, 'your-secret-key', { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: { nickname: user.nickname, avatarUrl: user.avatar_url },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '登录失败，请稍后再试！' });
  }
};