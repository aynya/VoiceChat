import React, { useEffect } from 'react';
import { Menu, Collapse } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';
import useRoomStore from '../../store/roomStore'

const ChannelList = () => {

    const textChannels = useRoomStore((state) => state.rooms).filter((room) => room.type === 'text')
    const voiceChannels = useRoomStore((state) => state.rooms).filter((room) => room.type === 'voice')
    const currentRoom = useRoomStore((state) => state.currentRoom)
    const joinRoom = useRoomStore((state) => state.joinRoom)
    const fetchRooms = useRoomStore((state) => state.fetchRooms)
    

    useEffect(() => {
        const init = async () => {
            await fetchRooms()
        }
        init()
    }, [fetchRooms])

    const items = [
        {
            key: 'text-channels',
            label: <span><MessageOutlined /> 文字频道</span>,
            children: (
                <Menu
                    mode="inline"
                    items={Array.isArray(textChannels) ? textChannels : []}
                    selectable
                    onSelect={(e) => {
                        joinRoom(e.key); 
                    }}
                    selectedKeys={Array.isArray(textChannels) && textChannels.some((c) => c.id === currentRoom?.id) ? [currentRoom?.id] : []}
                />
            )
        },
        {
            key: 'voice-channels',
            label: <span><TeamOutlined /> 语音频道</span>,
            children: (
                <Menu
                    mode="inline"
                    items={Array.isArray(voiceChannels) ? voiceChannels : []}
                    selectable
                    onSelect={(e) => {joinRoom(e.key); }}
                    selectedKeys={Array.isArray(voiceChannels) && voiceChannels.some((c) => c.id === currentRoom?.id) ? [currentRoom?.id] : []}
                />
            )
        }
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
        </div>
    );
};

export default ChannelList; 