import React, { useMemo, useState } from "react";

import { Input, Divider, List, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './search.css';
import useMessageStore from "../../store/messageStore";
import useRoomStore from "../../store/roomStore";


// 搜索面板组件
const SearchPanel = ({ onMessageClick }) => {
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const [searchKeyword, setSearchKeyword] = useState('');
    const onSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };
    const filteredMessages = useMemo(() => {
        const messages = currentRoom?.messages || [];
        return messages.filter(msg =>
            msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }, [currentRoom?.messages, searchKeyword]);

    return (
        <div style={{ padding: '16px' }}>
            <Input
                placeholder="搜索聊天记录..."
                value={searchKeyword}
                onChange={onSearchChange}
                prefix={<SearchOutlined />}
                allowClear
            />

            <Divider style={{ margin: '16px 0' }} />

            <List
                dataSource={filteredMessages}
                renderItem={(item) => (
                    <List.Item
                        className='search-result-item'
                        onClick={() => onMessageClick(item.id)}
                    >
                        <div className="message-preview">
                            <Avatar src={item.avatar} size="small" />
                            <span className="username">{item.username}</span>
                            <span className="content">{item.content}</span>
                            <span className="timestamp">{item.timestamp}</span>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default SearchPanel;