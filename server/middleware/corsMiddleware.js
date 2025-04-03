const cors = require('cors');

module.exports = cors({
  origin: "*", // 无限制的 CORS 配置
});