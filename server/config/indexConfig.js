module.exports = {
    jwtSecretKey: process.env.JWT_SECRET_KEY || 'your-default-secret-key',
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || 'your-default-refresh-secret-key',
    jwtAccessTokenExpiry: '3600s', // 访问令牌有效期 一小时
    jwtRefreshTokenExpiry: '86400s', // 刷新令牌有效期 一天
};