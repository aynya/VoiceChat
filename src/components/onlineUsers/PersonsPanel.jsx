// 好友列表组件
import { List, Avatar, Layout } from 'antd'
const { Sider } = Layout;
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import './friend.css';



// 好友列表组件
const PersonsPanel = () => (
    <Sider
        width={240}
        style={{
            background: '#fff',
            borderLeft: '1px solid #e8e8e8'
        }}
    >
        <div style={{ padding: '16px' }}>
            <div ><TeamOutlined /> 在线{-3}</div>
            <List
                dataSource={['小明', '小红', '小李']}
                renderItem={(item) => (
                    <List.Item className="friend-item" >
                        <Avatar icon={<UserOutlined />} />
                        <span style={{ marginLeft: 8 }} className="friend-name">{item}</span>
                    </List.Item>
                )}
            />
        </div>
    </Sider>
);

export default PersonsPanel;