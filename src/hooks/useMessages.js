import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { messageService } from '../services/messageService';

export const useMessages = (currentRoom, user, setCurrentRoom) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unsubscribe, setUnsubscribe] = useState(null);

    useEffect(() => {
        if (!currentRoom) {
            setMessages([]);
            return;
        }
        if (currentRoom) {
            fetchMessages();
        }
    }, [currentRoom?.id]);

    // 获取频道消息历史
    const fetchMessages = useCallback(async () => {
        console.log(1111111)
        if (!currentRoom) {
            setMessages([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await messageService.getChannelMessages(currentRoom.key);
            console.log(data)
            setCurrentRoom({...currentRoom, messages: data})
            setMessages(data);
            console.log("获取的消息", data)
        } catch (err) {
            console.error('获取消息失败:', err);
            setError('获取消息失败');
            message.error('获取消息失败');
        } finally {
            setLoading(false);
        }
    }, [currentRoom]);

    // 发送消息
    const sendMessage = (async (content) => {
        if (!currentRoom) return;

        try {
            const newMessage = await messageService.sendMessage(currentRoom.key, { content }, user);
            // setMessages(prev => [...prev, newMessage])
            setCurrentRoom({...currentRoom, messages: [...currentRoom.messages, newMessage]})
            return newMessage;
        } catch (err) {
            console.error('发送消息失败:', err);
            message.error('发送消息失败');
            throw err;
        }
    });

    // // 订阅频道消息更新
    // useEffect(() => {
    //     if (!channelId) {
    //         setMessages([]);
    //         if (unsubscribe) {
    //             unsubscribe();
    //         }
    //         return;
    //     }

    //     // 获取历史消息
    //     fetchMessages();

    //     const unsubscribeFn = messageService.subscribeToChannel(channelId, (newMessage) => {
    //         setMessages(prev => [...prev, newMessage]);
    //     });

    //     setUnsubscribe(() => unsubscribeFn);

    //     // 清理函数
    //     return () => {
    //         if (unsubscribe) {
    //             unsubscribe();
    //         }
    //     };
    // }, [channelId, fetchMessages]);

    // 添加新消息到列表
    const addMessage = useCallback((newMessage) => {
        setMessages(prev => [...prev, newMessage]);
    }, []);

    // 更新消息
    const updateMessage = useCallback((messageId, updates) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
        ));
    }, []);

    // 删除消息
    const deleteMessage = useCallback((messageId) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, []);

    return {
        messages,
        loading,
        error,
        sendMessage,
        addMessage,
        updateMessage,
        deleteMessage,
        refreshMessages: fetchMessages
    };
}; 