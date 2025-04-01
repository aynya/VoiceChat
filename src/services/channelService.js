
import axios from 'axios';

// TODO: 需要与后端API集成
// 目前使用模拟数据，后续需要替换为实际的API调用

const baseUrl = 'http://localhost:3001/api'

export const channelService = {
    // 获取文字频道列表
    getTextChannels: async () => {
        // TODO: 替换为实际的API调用
        const response = await axios.get(`${baseUrl}/rooms`);
        const textChannel = response.data.filter(room => room.type === 'text')
        console.log("获取的text频道", textChannel)
        return textChannel;
    },

    // 获取语音频道列表
    getVoiceChannels: async () => {
        // TODO: 替换为实际的API调用
        const response = await axios.get(`${baseUrl}/rooms`);
        const voiceChannel = response.data.filter(room => room.type === 'voice')
        return voiceChannel;
    },

    getRooms: async () => {
        // TODO: 替换为实际的API调用
        const response = await axios.get(`${baseUrl}/rooms`);
        // console.log("获取的rooms", response.data)
        return response.data;
    },

    // 创建新频道
    createChannel: async (roomId, type) => {
        // TODO: 替换为实际的API调用
        const newRoom = {
            id: roomId,
            label: roomId,
            type: type,
            users: [],
            messages: [],
            key: roomId
        }
        await axios.post(`${baseUrl}/rooms`, newRoom)
        return newRoom;
    },

    // 加入频道
    joinChannel: async (roomId, user) => {
        // TODO: 替换为实际的API调用
        await axios.post(`${baseUrl}/rooms/${roomId}/users`, user)
        
        console.log("加入频道", roomId, user)
        return true;
    },

    // 退出频道
    leaveChannel: async (roomId, user) => {
        // TODO: 替换为实际的API调用
        await axios.delete(`${baseUrl}/rooms/${roomId}/users/${user.id}`)
        console.log("退出频道", roomId, user)
        return true;
    }
}; 