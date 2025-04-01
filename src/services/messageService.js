// TODO: 需要与后端API集成
// 目前使用模拟数据，后续需要替换为实际的API调用

import axios from 'axios';

const baseUrl = 'http://localhost:3001/api'

export const messageService = {
    // 获取频道消息历史
    getChannelMessages: async (roomId) => {
        const response = await axios.get(`${baseUrl}/rooms/${roomId}/messages`)  
        return response.data;
    },

    // 发送消息
    sendMessage: async (channelId, message, user) => {
        const now = new Date();
        const newMessage = {
            type: 'user',
            username: user.username,
            avatar: user.avatar,
            content: message.content,
            timestamp: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        }
        const response = await axios.post(`${baseUrl}/rooms/${channelId}/messages`, newMessage)

        return response.data
    },

    // 订阅频道消息更新
    subscribeToChannel: (channelId, callback) => {
        // TODO: 替换为实际的WebSocket连接
        // 示例：const ws = new WebSocket(`ws://your-api/ws/channels/${channelId}`);
        // ws.onmessage = (event) => callback(JSON.parse(event.data));

        // 模拟实时消息
        const interval = setInterval(() => {
            console.log('模拟实时消息');
            if (Math.random() > 0.7) { // 30%的概率收到新消息
                callback({
                    id: Date.now(),
                    type: 'user',
                    username: '其他用户',
                    avatar: 'https://example.com/avatar3.png',
                    content: `这是来自 ${channelId} 的新消息`,
                    timestamp: new Date().toLocaleTimeString(),
                });
            }
        }, 5000); // 每5秒检查一次

        // 返回取消订阅的函数
        return () => clearInterval(interval);
    }
}; 