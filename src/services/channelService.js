
import axios from 'axios';
import { defaultChannels } from '../components/channels/types';

// TODO: 需要与后端API集成
// 目前使用模拟数据，后续需要替换为实际的API调用

const baseURL = 'http://localhost:3001/rooms'

export const channelService = {
    // 获取文字频道列表
    getTextChannels: async () => {
        // TODO: 替换为实际的API调用
        const response = await axios.get(baseURL);
        response.data.filter(room => room.type === 'text')
        return defaultChannels.text;
    },

    // 获取语音频道列表
    getVoiceChannels: async () => {
        // TODO: 替换为实际的API调用
        return defaultChannels.voice;
    },

    // 创建新频道
    createChannel: async (channelName, type) => {
        // TODO: 替换为实际的API调用
        return {
            key: channelName,
            label: channelName,
            type
        };
    },

    // 加入频道
    joinChannel: async (channelId) => {
        // TODO: 替换为实际的API调用
        return true;
    },

    // 退出频道
    leaveChannel: async (channelId) => {
        // TODO: 替换为实际的API调用
        return true;
    }
}; 