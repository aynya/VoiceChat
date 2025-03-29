import {create} from 'zustand';
import { message } from 'antd';
import { messageService } from '../services/messageService';
import useUserStore from './userStore';

const useMessageStore = create((set) => ({
    messages: [],

    // 获取房间消息
    fetchMessages: async (roomId) => {
        try {
            const messages = await messageService.getChannelMessages(roomId);
            set(() => ({
                messages
            }))
        } catch (error) {
            message.error('获取消息失败');
            console.error('获取消息失败:', error);
        }
    },

    // 发送消息
    sendMessage: async (roomId, content) => {
        const user = useUserStore.getState().user;
        try {
            await messageService.sendMessage(roomId, { content }, user);
        } catch (error) {
            message.error('发送消息失败');
            console.error('发送消息失败:', error);
        }
    }


}))

export default useMessageStore;