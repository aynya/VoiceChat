import React, { useState, useEffect } from 'react';
import { Menu, Collapse, Modal, Input, Button } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';
import useRoomStore from '../../store/roomStore'

const ChannelList = () => {
    const textChannels = useRoomStore((state) => state.rooms).filter((room) => room.type === 'text');
    const voiceChannels = useRoomStore((state) => state.rooms).filter((room) => room.type === 'voice');
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const joinRoom = useRoomStore((state) => state.joinRoom);
    const fetchRooms = useRoomStore((state) => state.fetchRooms);

    // 弹窗相关状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null); // 当前选中的房间 ID
    const [inputUid, setInputUid] = useState(''); // 用户输入的 UID

    useEffect(() => {
        const init = async () => {
            try {
                await fetchRooms();
            } catch (error) {
                console.error('获取房间列表失败:', error);
            }
        };
        init();
        const timeId = setInterval(init, 10000); // 每隔 10 秒刷新一次房间列表
        return () => clearInterval(timeId);
    }, [fetchRooms]);

    // 显示对话框
    const showModal = (roomId) => {
        setSelectedRoomId(roomId); // 设置当前选中的房间 ID
        setIsModalVisible(true); // 显示对话框
    };

    // 关闭对话框
    const handleCancel = () => {
        setIsModalVisible(false);
        setInputUid(''); // 清空输入框
    };

    // 确认加入房间
    const handleOk = () => {
        const selectedRoom = [...textChannels, ...voiceChannels].find((room) => room.id === selectedRoomId);
        if (selectedRoom && selectedRoom.uid === inputUid) {
            // 如果 UID 匹配，加入房间
            joinRoom(selectedRoomId);
            setIsModalVisible(false);
            setInputUid(''); // 清空输入框
        } else {
            // 如果 UID 不匹配，提示错误
            Modal.error({
                title: '错误',
                content: '输入的房间 UID 不正确，请重试。',
            });
        }
    };

    const items = [
        {
            key: 'text-channels',
            label: <span><MessageOutlined /> 文字频道</span>,
            children: (
                <Menu
                    mode="inline"
                    items={Array.isArray(textChannels) ? textChannels.map((textChannel) => ({ ...textChannel, key: textChannel.id })) : []}
                    selectable
                    onSelect={(e) => {
                        showModal(e.key); // 显示对话框
                    }}
                    selectedKeys={
                        Array.isArray(textChannels) && textChannels.some((c) => c.id === currentRoom?.id)
                            ? [currentRoom?.id]
                            : []
                    }
                />
            ),
        },
        {
            key: 'voice-channels',
            label: <span><TeamOutlined /> 语音频道</span>,
            children: (
                <Menu
                    mode="inline"
                    items={Array.isArray(voiceChannels) ? voiceChannels.map((voiceChannel) => ({ ...voiceChannel, key: voiceChannel.id })) : []}
                    selectable
                    onSelect={(e) => {
                        showModal(e.key); // 显示对话框
                    }}
                    selectedKeys={
                        Array.isArray(voiceChannels) && voiceChannels.some((c) => c.id === currentRoom?.id)
                            ? [currentRoom?.id]
                            : []
                    }
                />
            ),
        },
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
                <Collapse
                    items={items}
                    defaultActiveKey={['text-channels', 'voice-channels']}
                    ghost
                    expandIconPosition="end"
                    style={{ border: 0 }}
                />
            </div>

            {/* 弹出对话框 */}
            <Modal
                title="请输入房间 UID"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
            >
                <Input
                    placeholder="请输入房间 UID"
                    value={inputUid}
                    onChange={(e) => setInputUid(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default ChannelList; 