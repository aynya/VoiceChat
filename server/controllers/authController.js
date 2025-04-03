const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');
const config = require('../config/indexConfig');
const tokenUtils = require('../utils/tokenUtils');

const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = tokenUtils;

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

        const user = { id: existingUsers.insertId, nickname };
        const payload = { userId: user.id, nickname: user.nickname };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.json({
            success: true,
            message: '注册成功！',
            accessToken,
            refreshToken,
        });
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

        const payload = { userId: user.id, nickname: user.nickname };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const jwtExpiryInSeconds = parseInt(config.jwtRefreshTokenExpiry);
        const cookieMaxAge = jwtExpiryInSeconds * 1000; // 转换为毫秒

        // 将 refreshToken 存储到 HttpOnly Cookie 中
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // 防止 JavaScript 访问
            secure: process.env.NODE_ENV === 'production',   
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 防止 CSRF 攻击
            domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
            path: '/',      // Cookie 的作用域
            maxAge: cookieMaxAge, // 设置过期时间
        });

        res.json({
            success: true,
            user: { nickname: user.nickname, avatarUrl: user.avatar_url },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '登录失败，请稍后再试！' });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
        console.log('刷新令牌缺失')
        return res.status(400).json({ error: '刷新令牌缺失！' });
    }

    try {
        const decoded = verifyRefreshToken(refreshTokenFromCookie);
        if (!decoded) {
            return res.status(401).json({ error: '无效的刷新令牌！' });
        }

        const payload = { userId: decoded.userId, nickname: decoded.nickname };
        const newAccessToken = generateAccessToken(payload);

        res.json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: '无效的刷新令牌！' });
    }
};