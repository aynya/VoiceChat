import React, { useEffect, useState } from 'react';
import { Button, Avatar, Dropdown, Tooltip, message } from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    AudioOutlined,
    AudioMutedOutlined,
    CopyOutlined
} from '@ant-design/icons';
import useRoomStore from '../../store/roomStore';
import useUserStore from '../../store/userStore';
import useSocketStore from '../../store/socketStore';
import { useNavigate } from 'react-router-dom';

const ChannelFooter = () => {
    const isInRoom = useRoomStore((state) => state.isInRoom);
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const handleCreate = useRoomStore((state) => state.handleCreate);
    const handleExit = useRoomStore((state) => state.handleExit);
    const user = useUserStore((state) => state.user);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { handleLogout } = useRoomStore();
    const navigate = useNavigate();


    const { roomId, localAudioStream, remoteAudioStreams } = useSocketStore();

    console.log(localAudioStream, remoteAudioStreams)

    useEffect(() => {
        setIsSpeaking(false)
    }, [roomId]);

    // 初始化时禁用音频轨道
    useEffect(() => {
        if (localAudioStream) {
            const audioTracks = localAudioStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks.forEach((track) => {
                    track.enabled = false; // 初始状态禁用音频轨道
                });
                console.log('初始化：音频轨道已禁用');
            }
        }
    }, [localAudioStream]);
    // 控制语音开关
    const handleVoiceToggle = () => {
        if (!localAudioStream) {
            console.error('本地音频流未初始化');
            return;
        }

        const newIsSpeaking = !isSpeaking; // 计算新的状态
        setIsSpeaking(newIsSpeaking);

        // 获取所有音频轨道并切换状态
        const audioTracks = localAudioStream.getAudioTracks();
        if (audioTracks.length > 0) {
            audioTracks.forEach((track) => {
                track.enabled = newIsSpeaking; // 同步音频轨道状态
            });
        }

        if (newIsSpeaking) {
            console.log('开始录音');
        } else {
            console.log('停止录音');
        }
    };

    const onLogout = async () => {
        await handleLogout();
        localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        localStorage.removeItem('loggedInUser');
        navigate('/');
    }

    // 把房间ID复制到剪切板
    const handleCopyRoomId = () => {
        if (currentRoom?.id) {
            navigator.clipboard.writeText(currentRoom.id).then(() => {
                message.success(`已复制房间 ID: ${currentRoom.id}`);
            }).catch((err) => {
                console.error('复制失败:', err);
                message.error('复制失败，请重试');
            });
        }
    }

    // console.log(currentRoom);
    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid #e8e8e8',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
        }}>
            {/* 音频元素 */}
            <audio ref={(ref) => ref && (ref.srcObject = localAudioStream)} autoPlay muted />
            {Object.entries(remoteAudioStreams).map(([userId, stream]) => {
                if (!stream) return null; // 如果音频流为空，跳过渲染
                return (
                    <audio
                        key={userId}
                        ref={(ref) => ref && (ref.srcObject = stream)}
                        autoPlay
                    />
                );
            })}
            {isInRoom && (
                <Tooltip title="当前所在房间">
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: 8,
                        textAlign: 'center',
                        maxWidth: '80%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                        当前房间：{currentRoom?.id}

                    </div>
                </Tooltip>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {!isInRoom && (
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={handleCreate}
                        />
                    )}
                    {isInRoom && (
                        <>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<CloseOutlined />}
                                size="large"
                                onClick={() => { setIsSpeaking(false); handleExit(); }}
                            />
                            <Button
                                type={isSpeaking ? "primary" : "default"}
                                shape="circle"
                                icon={isSpeaking ? <AudioOutlined /> : <AudioMutedOutlined />}
                                size="large"
                                onClick={handleVoiceToggle}
                                danger={isSpeaking}
                            />
                            <Button
                                type="default" // 使用默认类型，避免过于突兀
                                shape="circle"
                                icon={<CopyOutlined style={{ color: '#52c41a' }} />} // 设置图标的颜色
                                size="large"
                                onClick={handleCopyRoomId}
                                style={{
                                    border: '2px solid #52c41a', // 添加边框以增强视觉效果
                                    color: '#52c41a', // 设置文字颜色（如果有）
                                    backgroundColor: '#ffffff', // 设置背景颜色为白色
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // 添加轻微阴影
                                    transition: 'all 0.3s ease', // 添加平滑过渡效果
                                    marginLeft: 8 // 调整与左侧内容的间距
                                }}
                            />
                        </>
                    )}
                </div>

                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'username',
                                label: <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{user?.username}</span>,
                                disabled: true,
                              },
                            {
                                key: 'logout',
                                label: <span style={{ color: '#ff4d4f' }}>退出登录</span>,
                                onClick: onLogout
                            }
                        ]
                    }}
                >
                    <Avatar size={40} src={user?.avatar}>
                        <UserOutlined />
                    </Avatar>
                </Dropdown>
            </div>
        </div>
    );
};

export default ChannelFooter; 