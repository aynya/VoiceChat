const { verifyAccessToken } = require('../utils/tokenUtils');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid access token' });
    }

    req.user = decoded;
    next();
};

module.exports = authMiddleware;