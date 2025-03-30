import {create} from 'zustand';
import { message } from 'antd';
import { channelService } from '../services/channelService';
import useUserStore from './userStore';
import { ChannelStep, ChannelType } from '../components/channels/types';
import useSocketStore from './socketStore';

const useRoomStore = create((set) => ({
    rooms: [],

    fetchRooms: async () => {
        try {
            const rooms = await channelService.getRooms();
            set(() => ({
                rooms
            }));
        } catch (error) {
            console.error('获取房间列表失败:', error);
            throw error;
        }
    },

    currentRoom: null,
    // setCurrentRoom: (currentRoom) => set(() => ({
    //     currentRoom
    // })),

    isInRoom: false,
    // setIsInRoom: (isInRoom) => set(() => ({
    //     isInRoom
    // })),
    // 判断房间是否存在
    checkRoomExist: (roomId) => {
        const room = useRoomStore.getState().rooms.find(room => room.id === roomId);
        return !!room;
    },

    // 创建新房间
    createRoom: async (roomId, type) => {
        try {
            const { checkRoomExist, joinRoom } = useRoomStore.getState();

            if (checkRoomExist(roomId)) {
                message.error('房间已存在');
                throw new Error('房间已存在');
            }
            const newRoom = await channelService.createChannel(roomId, type);

            set((state) => ({
                rooms: [...state.rooms, newRoom]
            }));
            // 创建后加入房间
            await joinRoom(roomId);
            return true;
        } catch (error) {
            console.error('创建房间失败:', error);
            throw error;
        }
    },
    // 加入房间
    joinRoom: async (roomId) => {
        try {
            const { user } = useUserStore.getState();
            const { exitRoom, rooms, isInRoom } = useRoomStore.getState();
            const {joinRoom, setRoomId, localAudioStream } = useSocketStore.getState();
            // console.log(rooms)
            const room = rooms.find(room => room.id === roomId);
            if (!room) {
                message.error('房间不存在');
                return false;
            }

            if (isInRoom) {
                await exitRoom();
            }

            const success = await channelService.joinChannel(roomId, user);
            if (!success) {
                message.error('加入房间失败');
                return false;
            }
            joinRoom(roomId)
            setRoomId(roomId)
            if (localAudioStream) { // 如果本地音频流存在，则禁用音频轨道
                const audioTracks = localAudioStream.getAudioTracks();
                if (audioTracks.length > 0) {
                    audioTracks.forEach((track) => {
                        track.enabled = false; // 初始状态禁用音频轨道
                    });
                    console.log('初始化：音频轨道已禁用');
                }
            }
            set(() => ({
                isInRoom: true,
                currentRoom: {
                    ...room,
                    users: [...room.users, user]
                }
            }));

            return true;
        } catch (error) {
            console.error('加入房间失败:', error);
            throw error;
        }
    },
    // 退出房间
    exitRoom: async () => {
        try {
            const { isInRoom, currentRoom } = useRoomStore.getState();
            const { user } = useUserStore.getState();
            const { leaveRoom, roomId, localAudioStream } = useSocketStore.getState();

            if (!isInRoom) {
                console.warn('未加入任何房间，无需退出');
                return;
            }
            await channelService.leaveChannel(currentRoom.id, user);
            
            leaveRoom(roomId)
            if (localAudioStream) {
                const audioTracks = localAudioStream.getAudioTracks();
                if (audioTracks.length > 0) {
                    audioTracks.forEach((track) => {
                        track.enabled = false; // 初始状态禁用音频轨道
                    });
                    console.log('初始化：音频轨道已禁用');
                }
            }
            
            set(() => ({
                isInRoom: false,
                currentRoom: null
            }));
        } catch (error) {
            console.error('退出房间失败:', error);
            throw error;
        }
    },

    currentStep: ChannelStep.SELECT_ACTION,
    roomId: '',
    setRoomId: (roomId) => {
        set(() => ({
            roomId
        }))
    },
    selectedType: ChannelType.TEXT,
    // 手动确认
    handleConfirm: async () => {
        const { currentStep, roomId, createRoom, selectedType, handleCancel, joinRoom } = useRoomStore.getState();
        if (currentStep === ChannelStep.CREATE_NAME) {
            if (!roomId.trim()) return message.error('请输入房间号')

            try {
                await createRoom(roomId, selectedType);
                message.success('创建成功')
                handleCancel()
            } catch (error) {
                message.error('创建频道失败')
                console.log('创建频道失败', error)
            }
        } else if (currentStep === ChannelStep.JOIN_NAME) {
            if (!roomId.trim()) return message.error('请输入房间号');
            try {
                const success = await joinRoom(roomId);
                if (success) {
                    handleCancel();
                }
            } catch (error) {
                message.error('加入频道失败');
                console.log('加入频道失败', error)
            }
        }

    },


    isCreating: false,
    // 手动取消
    handleCancel: () => {
        console.log(1)
        set(() => ({
            isCreating: false,
            currentStep: ChannelStep.SELECT_ACTION,
            roomId: '',
        }))
    },

    // 手动创建
    handleCreate: () => {
        console.log(11)
        set(() => ({
            isCreating: true,
            currentStep: ChannelStep.SELECT_ACTION,
        }))
    },

    // 下一步
    handleNextStep: () => {
        const { currentStep } = useRoomStore.getState();
        if (currentStep === ChannelStep.SELECT_ACTION) {
            set(() => ({
                currentStep: ChannelStep.CREATE_NAME,
            }))
        } else if (currentStep === ChannelStep.CREATE_TYPE) {
            set(() => ({
                currentStep: ChannelStep.CREATE_NAME
            }))
        }
    },

    // 手动下一步
    handleSetCurrentStep: (step) => {
        set(() => ({
            currentStep: step
        }))
    },

    // 手动选择类型
    handleSelectType: (type) => {
        const { handleNextStep } = useRoomStore.getState();
        handleNextStep()
        set(() => ({
            selectedType: type
        }))
    },

    // 手动退出房间
    handleExit: async () => {
        const { exitRoom } = useRoomStore.getState();
        try {
            await  exitRoom();
            message.info('已退出当前房间');
        } catch (error) {
            message.error('退出房间失败');
            console.log('退出房间失败', error)
        }
    },

    // 退出登录
    handleLogout: () => {
        message.success('退出登录成功');
    },


}))

export default useRoomStore