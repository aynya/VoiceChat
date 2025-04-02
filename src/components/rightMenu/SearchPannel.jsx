import React, { useMemo, useState } from "react";

import { Input, Divider, List, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './search.css';
import useSocketStore from "../../store/socketStore";


// 搜索面板组件
const SearchPanel = ({ onMessageClick }) => {
    const messages = useSocketStore(state => state.messages);
    console.log(messages)
    const [searchKeyword, setSearchKeyword] = useState('');
    const onSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };
    const filteredMessages = useMemo(() => {
        return messages.filter(msg =>
            msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }, [searchKeyword, messages]);

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
                        onClick={() => { onMessageClick(item.id); }}
                    >
                        <div className="message-preview">
                            <Avatar src={item.avatar} size="small" />
                            <div className="content-container">
                                <div className="header">
                                    <span className="username">{item.username}</span>
                                    <span className="timestamp">{item.timestamp}</span>
                                </div>
                                <p className="content">{item.content}</p>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default SearchPanel;