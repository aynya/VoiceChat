const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password', // 替换为你的数据库密码
  database: process.env.DB_NAME || 'voice_chat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});