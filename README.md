技术栈：JavaScript + React + Zustand + Node.js + MySQL + Socket.IO + WebRTC

技术亮点：
- 使用Zustand管理用户状态，响应式状态更新，提供流畅的用户交互体验
- 实现WebRTC点对点音频传输，通过ICE候选协商和STUN服务器实现NAT穿透
- 使用动态PeerConnection管理机制，根据用户加入离开自动创建和销毁连接，确保资源高效利用
- 实现Socket.IO事件驱动架构，支持房间管理、消息广播和用户状态同步、构建实时响应的用户体验
- 使用JWT鉴权 & HttpOnly Cookie 实现双Token认证机制，结合axios拦截器实现自动刷新，检测活跃实现滑动刷新
