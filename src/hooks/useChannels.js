import { useState, useEffect } from 'react';
import { message } from 'antd';
import { channelService } from '../services/channelService';
import { ChannelStep, ChannelType } from '../components/channels/types';

export const useChannels = () => {
    // 状态管理
    const [isCreating, setIsCreating] = useState(false);
    const [currentStep, setCurrentStep] = useState(ChannelStep.SELECT_ACTION);
    const [selectedType, setSelectedType] = useState(ChannelType.TEXT);
    const [channelName, setChannelName] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [textChannels, setTextChannels] = useState([]);
    const [voiceChannels, setVoiceChannels] = useState([]);
    const [loading, setLoading] = useState(false);

    // 初始化加载频道列表
    useEffect(() => {
        const loadChannels = async () => {
            setLoading(true);
            try {
                const [textChannelsData, voiceChannelsData] = await Promise.all([
                    channelService.getTextChannels(),
                    channelService.getVoiceChannels()
                ]);
                setTextChannels(Array.isArray(textChannelsData) ? textChannelsData : []);
                setVoiceChannels(Array.isArray(voiceChannelsData) ? voiceChannelsData : []);
            } catch (error) {
                console.error('加载频道失败:', error);
                message.error('加载频道失败');
            } finally {
                setLoading(false);
            }
        };

        loadChannels();
    }, []);

    // 检查频道是否存在
    const checkChannelExists = (channelId) => {
        return [...textChannels, ...voiceChannels].some(channel =>
            channel.key === channelId || channel.label === channelId
        );
    };
    // 创建新频道
    const createChannel = async (channelName, type) => {
        try {
            // 检查频道是否存在
            if (checkChannelExists(channelName)) {
                message.error('频道已存在');
                throw new Error('频道已存在');
            }
            const newChannel = await channelService.createChannel(channelName, type);
            if (type === ChannelType.TEXT) {
                setTextChannels(prev => [...prev, newChannel]);
            } else {
                setVoiceChannels(prev => [...prev, newChannel]);
            }
            // setCurrentRoom({ key: newChannel.key, name: newChannel.label });
            // setIsInRoom(true);
            joinChannel(newChannel.key);
            return newChannel;
        } catch (error) {
            console.error('创建频道失败:', error);
            throw error;
        }
    };

    

    // 加入频道
    const joinChannel = async (channelId) => {
        try {
            // 先检查频道是否存在
            if (!checkChannelExists(channelId)) {
                message.error('房间不存在');
                return false;
            }

            const success = await channelService.joinChannel(channelId);
            if (success) {
                setIsInRoom(true);
                const channel = [...textChannels, ...voiceChannels].find(c =>
                    c.key === channelId || c.label === channelId
                );
                if (channel) {
                    console.log(channel.messages)
                    setCurrentRoom(channel);
                }
            }
            return success;
        } catch (error) {
            console.error('加入频道失败:', error);
            throw error;
        }
    };

    // 退出频道
    const leaveChannel = async () => {
        try {
            if (currentRoom) {
                const success = await channelService.leaveChannel(currentRoom.key);
                if (success) {
                    setIsInRoom(false);
                    setCurrentRoom(null);
                }
            }
        } catch (error) {
            console.error('退出频道失败:', error);
            throw error;
        }
    };

    // 处理函数
    const handleChannelSelect = async (key) => {
        try {
            await joinChannel(key);
        } catch (error) {
            message.error('加入频道失败');
        }
    };

    const handleConfirm = async () => {
        if (currentStep === ChannelStep.CREATE_NAME) {
            if (!channelName.trim()) return message.error('请输入频道名称');

            try {
                await createChannel(channelName, selectedType);
                message.success('频道创建成功！');
                handleCancel();
            } catch (error) {
                message.error('创建频道失败');
            }
        } else if (currentStep === ChannelStep.JOIN_NAME) {
            if (!channelName.trim()) return message.error('请输入房间号');

            try {
                const success = await joinChannel(channelName);
                if (success) {
                    handleCancel();
                }
            } catch (error) {
                message.error('加入频道失败');
            }
        }
    };

    const handleCreate = () => {
        setIsCreating(true);
        setCurrentStep(ChannelStep.SELECT_ACTION);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setCurrentStep(ChannelStep.SELECT_ACTION);
        setChannelName('');
    };

    const handleNextStep = () => {
        if (currentStep === ChannelStep.SELECT_ACTION) {
            setCurrentStep(ChannelStep.CREATE_TYPE);
        } else if (currentStep === ChannelStep.CREATE_TYPE) {
            setCurrentStep(ChannelStep.CREATE_NAME);
        }
    };

    const handleSetCurrentStep = (step) => {
        setCurrentStep(step);
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        handleNextStep();
    };

    const handleExit = async () => {
        try {
            await leaveChannel();
            message.info('已退出当前房间');
        } catch (error) {
            message.error('退出房间失败');
        }
    };

    const handleLogout = () => {
        message.success('退出登录成功');
    };

    return {
        isCreating,
        currentStep,
        selectedType,
        channelName,
        isInRoom,
        currentRoom,
        textChannels,
        voiceChannels,
        loading,
        handleSetCurrentStep,
        setChannelName,
        handleChannelSelect,
        handleConfirm,
        handleCreate,
        handleCancel,
        handleNextStep,
        handleSelectType,
        handleExit,
        handleLogout
    };
}; 