import React from 'react';
import { Menu, Collapse } from 'antd';
import { MessageOutlined, TeamOutlined } from '@ant-design/icons';

const ChannelList = ({
    textChannels = [],
    voiceChannels = [],
    currentRoom,
    onChannelSelect
}) => {
    const items = [
        {
            key: 'text-channels',
            label: <span><MessageOutlined /> 文字频道</span>,
            children: (
                <Menu
                    mode="inline"
                    items={Array.isArray(textChannels) ? textChannels : []}
                    selectable
                    onSelect={(e) => onChannelSelect(e.key)}
                    selectedKeys={Array.isArray(textChannels) && textChannels.some((c) => c.key === currentRoom?.key) ? [currentRoom?.key] : []}
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
                    onSelect={(e) => onChannelSelect(e.key)}
                    selectedKeys={Array.isArray(voiceChannels) && voiceChannels.some((c) => c.key === currentRoom?.key) ? [currentRoom?.key] : []}
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