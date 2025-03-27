// TODO: 需要与后端API集成
// 目前使用模拟数据，后续需要替换为实际的API调用

export const messageService = {
    // 获取频道消息历史
    getChannelMessages: async (channelId) => {
        // TODO: 替换为实际的API调用
        // 示例：const response = await fetch(`/api/channels/${channelId}/messages`);
        // return await response.json();

        // 模拟不同频道的消息数据
        const mockMessages = {
            'general': [
                {
                    id: 1,
                    type: 'system',
                    content: '欢迎来到 #综合聊天 频道',
                    timestamp: new Date().toLocaleTimeString()
                },
                {
                    id: 2,
                    type: 'user',
                    username: '用户A',
                    avatar: 'https://example.com/avatar1.png',
                    content: '大家好！',
                    timestamp: new Date().toLocaleTimeString(),
                }
            ],
            'lounge': [
                {
                    id: 1,
                    type: 'system',
                    content: '欢迎来到 #临时代碼 频道',
                    timestamp: new Date().toLocaleTimeString()
                },
                {
                    id: 2,
                    type: 'user',
                    username: '用户B',
                    avatar: 'https://example.com/avatar2.png',
                    content: '这里是代码讨论区',
                    timestamp: new Date().toLocaleTimeString(),
                }
            ],
            'voice-1': [
                {
                    id: 1,
                    type: 'system',
                    content: '欢迎来到 #语音频道 1',
                    timestamp: new Date().toLocaleTimeString()
                }
            ]
        };

        return mockMessages[channelId] || [];
    },

    // 发送消息
    sendMessage: async (channelId, message) => {
        // TODO: 替换为实际的API调用
        // 示例：const response = await fetch(`/api/channels/${channelId}/messages`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(message)
        // });
        // return await response.json();

        return {
            id: Date.now(),
            type: 'user',
            username: '当前用户',
            avatar: 'https://example.com/avatar2.png',
            content: message.content,
            timestamp: new Date().toLocaleTimeString(),
        };
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