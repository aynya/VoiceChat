module.exports = {
    jwtSecretKey: process.env.JWT_SECRET_KEY || 'your-default-secret-key',
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || 'your-default-refresh-secret-key',
    jwtAccessTokenExpiry: '1h', // 访问令牌有效期
    jwtRefreshTokenExpiry: '7d', // 刷新令牌有效期
};