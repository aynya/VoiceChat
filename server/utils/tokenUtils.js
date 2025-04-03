const jwt = require('jsonwebtoken');
const config = require('../config/indexConfig')

const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.jwtSecretKey, { expiresIn: config.jwtAccessTokenExpiry });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwtRefreshSecretKey, { expiresIn: config.jwtRefreshTokenExpiry });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecretKey);
    } catch (err) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwtRefreshSecretKey);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};