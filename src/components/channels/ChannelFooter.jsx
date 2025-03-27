import React, { useState } from 'react';
import { Button, Avatar, Dropdown, Tooltip } from 'antd';
import {
    UserOutlined,
    PlusOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    AudioOutlined,
    AudioMutedOutlined
} from '@ant-design/icons';

const ChannelFooter = ({
    isInRoom,
    currentRoom,
    onCreate,
    onExit,
    onLogout
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleVoiceToggle = () => {
        setIsSpeaking(!isSpeaking);
        // TODO: 在这里添加实际的语音控制逻辑
        if (!isSpeaking) {
            // 开始录音
            console.log('开始录音');
        } else {
            // 停止录音
            console.log('停止录音');
        }
    };

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
                        当前房间：{currentRoom?.label}
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
                            onClick={onCreate}
                        />
                    )}
                    {isInRoom && (
                        <>
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<CloseOutlined />}
                                size="large"
                                onClick={() => {setIsSpeaking(false); onExit(); }}
                            />
                            <Button
                                type={isSpeaking ? "primary" : "default"}
                                shape="circle"
                                icon={isSpeaking ? <AudioOutlined /> : <AudioMutedOutlined />}
                                size="large"
                                onClick={handleVoiceToggle}
                                danger={isSpeaking}
                            />
                        </>
                    )}
                </div>

                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'logout',
                                label: <span style={{ color: '#ff4d4f' }}>退出登录</span>,
                                onClick: onLogout
                            }
                        ]
                    }}
                >
                    <Avatar size={40}>
                        <UserOutlined />
                    </Avatar>
                </Dropdown>
            </div>
        </div>
    );
};

export default ChannelFooter; 