import apiClient from './apiClient';
import { nanoid } from 'nanoid';
import { message } from 'antd';

const baseUrl = 'http://43.139.233.108:3001/api';

export const channelService = {
    // 获取文字频道列表
    getTextChannels: async () => {
        const response = await apiClient.get(`${baseUrl}/rooms`);
        const textChannel = response.data.filter(room => room.type === 'text');
        console.log("获取的text频道", textChannel);
        return textChannel;
    },

    // 获取语音频道列表
    getVoiceChannels: async () => {
        const response = await apiClient.get(`${baseUrl}/rooms`);
        const voiceChannel = response.data.filter(room => room.type === 'voice');
        return voiceChannel;
    },

    getRooms: async () => {
        const response = await apiClient.get(`${baseUrl}/rooms`);
        return response.data;
    },

    // 创建新房间
    createChannel: async (roomName, type) => {
        const uuid = nanoid(8);
        const newRoom = {
            id: uuid,
            label: roomName,
            uid: uuid,
            type: type,
            users: [],
            messages: [],
            key: uuid
        };
        const res = await apiClient.post(`${baseUrl}/rooms`, newRoom);
        return res.data;
    },

    // 加入频道
    joinChannel: async (roomId, user) => {
        try {
            await apiClient.post(`${baseUrl}/rooms/${roomId}/users`, user, {
                withCredentials: true, // 确保接收并存储 Cookie
            });
            console.log("加入频道", roomId, user);
            return true;
        } catch (error) {
            const status = error.response.status;
            if (status === 409) {
                message.error('您的账号已在别处使用');
            }
            console.log("加入频道失败", error);
            return false;
        }
    },

    // 退出频道
    leaveChannel: async (roomId, user) => {
        await apiClient.delete(`${baseUrl}/rooms/${roomId}/users/${user.id}`);
        console.log("退出频道", roomId, user);
        return true;
    }
};