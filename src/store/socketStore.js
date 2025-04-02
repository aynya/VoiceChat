// store.js
import { create } from 'zustand';
import io from 'socket.io-client';
import useUserStore from './userStore';
import { messageService } from '../services/messageService';

let socket = null;

const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', { transports: ['websocket'] });
  }
  return socket;
};

const  formatDateTime = (isoString) => { // 格式化时间戳为 YYYY-MM-DD HH:mm:ss
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const useSocketStore = create((set, get) => ({
  // 状态
  messages: [],
  message: '',
  users: [],
  myId: '',
  roomId: '',
  setRoomId: (roomId) => set({ roomId }),
  localAudioStream: null,
  remoteAudioStreams: {},
  peersRef: {}, // 存储所有 PeerConnection

  // 设置消息
  setMessage: (newMessage) => set({ message: newMessage }),

  // 加入房间
  joinRoom: async (roomId) => {
    const user = useUserStore.getState().user;
    console.log(user)
    if (roomId.trim()) {
      socket.emit('join-room', roomId.trim(), user);
      set({ roomId });
      const messages = await messageService.getChannelMessages(roomId);
      set({ messages: messages.map((message) => ({
        ...message,
        timestamp: formatDateTime(message.timestamp)
      }))})
    }
  },

  // 离开房间
  leaveRoom: (roomId) => {
    const { myId, peersRef } = get();
    if (roomId && myId) {
      socket.emit('leave-room', roomId);
      Object.values(peersRef).forEach(pc => pc.close());
      set({
        messages: [],
        message: '',
        roomId: '',
        peersRef: {},
        users: [], // 清空用户列表
      });
    }
  },

  // 发送消息
  sendMessage: (message) => {
    const user = useUserStore.getState().user;
    if (message.trim()) {
      const now = new Date();
      socket.emit('chat message', {
        type: 'user',
        username: user.username,
        avatar: user.avatar,
        content: message,
        timestamp: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
      });
      set({ message: '' });
    }
  },

  // 初始化本地音频流
  initLocalAudioStream: async () => {
    console.log('开启')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      set({ localAudioStream: stream });
    } catch (err) {
      console.error('获取本地音频失败:', err);
    }
  },

  // 关闭本地音频流
  closeLocalAudioStream: () => {
    console.log('tuichu')
    const { localAudioStream } = get();
    if (localAudioStream) {
      localAudioStream.getTracks().forEach(track => track.stop());
      set({ localAudioStream: null });
    }
  },

  // 处理信令
  handleSignal: async ({ senderId, signal }) => {
    const { peersRef } = get();
    let pc = peersRef[senderId];

    if (!pc) {
      pc = get().createPeerConnection(senderId); // 被动方创建连接
    }

    try {
      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('signal', { targetId: senderId, signal: answer });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(signal));
      }
    } catch (err) {
      console.error('信令处理失败:', err);
    }
  },

  // 创建 PeerConnection
  createPeerConnection: (targetId, isInitiator = false) => {
    const { localAudioStream, peersRef } = get();
    if (peersRef[targetId]) return; // 避免重复创建

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // 添加本地音频轨道
    localAudioStream?.getTracks().forEach((track) => {
      pc.addTrack(track, localAudioStream);
    });

    // 处理远程流
    pc.ontrack = (e) => {
      set((state) => ({
        remoteAudioStreams: {
          ...state.remoteAudioStreams,
          [targetId]: e.streams[0], // 将音频流与目标用户关联
        },
      }));
    };

    // 收集 ICE 候选
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('signal', { targetId, signal: e.candidate.toJSON() });
      }
    };

    set((state) => ({
      peersRef: { ...state.peersRef, [targetId]: pc },
    }));

    // 如果是主动方，创建 Offer
    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('signal', { targetId, signal: pc.localDescription });
        });
    }

    return pc;
  },

  // 监听 Socket 事件
  setupSocketListeners: () => {
    initializeSocket();
    socket.on('myId', (id) => { set({ myId: id }); });
    // 用户加入房间后，接收房间中的用户列表
    socket.on('room-users', ({roomId, users}) => {
      set({roomId, users})
    })
    socket.on('chat message', (msg) =>
      set((state) => ({
        messages: [...state.messages, {
          ...msg,
          id: state.messages.length + 1
        }]
      }))
    );
    socket.on('user-connected', (user) => {
      const newUser = user;
      set((state) => ({
        users: [...state.users, newUser],
      }));
      get().createPeerConnection(user.id, true)
    });
    socket.on('user-disconnected', (userId) => {
      const { peersRef } = get();
      if (peersRef[userId]) {
        peersRef[userId].close();
        delete peersRef[userId];
        set((state) => ({
          peersRef: { ...state.peersRef },
          users: state.users.filter((user) => user.id !== userId),
          remoteAudioStreams: {
            ...state.remoteAudioStreams,
            [userId]: undefined, // 移除对应用户的音频流
          },
        }));
      }
    });
    socket.on('signal', get().handleSignal);

    return () => {
      socket.off('myId');
      socket.off('chat message');
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('signal');
      socket.off('room-users');
      socket = null;
    };
  },
}));

export default useSocketStore;