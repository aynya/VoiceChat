const cors = require('cors');

module.exports = cors({
  origin:  ["http://43.139.233.108", "http://localhost:5173"], // 无限制的 CORS 配置
  credentials: true,
});