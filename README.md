# VoiceChat - 多人在线聊天频道
VoiceChat是基于JavaScript + React + Zustand + Node.js构建的多人聊天应用

# 主要功能
- 🔐 用户认证
  - ✅ 账号密码登录
  - ✅ JWT token 认证
- 👥 房间系统
  - ✅ 用户创建房间
  - ✅ 用户加入房间
  - ✅ 房间在线用户显示
- 💬 即使通讯
  - ✅ 群聊功能（文字 + 语音）
  - ✅ 历史消息记录
  - ❌ 个性化

# 技术栈
### 前端
- React + Vite: 高性能的开发框架
- JavaScript: 基础编程语言，用于实现复杂的交互逻辑和功能
- StoryBook: 用于独立开发和测试UI组件
- Ant Design: 提供丰富的企业级UI组件，帮助快速构建美观且一致的用户界面
- Socket.IO Client: 实现与后端Socket.IO服务器的实时双向通信，支持房间管理、消息广播等
- WebRTC: 实现实时音频传输，通过ICE候选协商和STUN服务器实现NAT穿透，提供点对点的音频通话功能

### 后端
- node.js: 处理客户端请求，实现业务逻辑
- MySQL: 数据库管理系统，用于存储用户数据、聊天记录等信息
- Socket.IO: 提供实时的双向事件驱动通信机制，支持房间管理、消息广播和用户状态同步
- WebRTC: 在服务端辅助处理WebRTC相关连接管理和信令交换，确保客户端之间的顺利通信

# 开发环境设置
1. 克隆
```bash
git clone https://github.com/aynya/VoiceChat.git
```

2. 安装依赖
```bash
# 前端
cd VoiceChat
npm install

# 后端
cd VoiceChat/server
npm install
```

3. 启动
```bash
# 前端
cd VoiceChat
npm run dev

# 后端服务器
cd VoiceChat/server
npm run dev
```
4. 数据库配置
- 创建MySQl数据库`voice_chat`
- 配置连接信息（message、rgtusers、rooms、users）
