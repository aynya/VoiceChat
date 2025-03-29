// 好友列表组件
import { List, Avatar, Layout } from 'antd'
const { Sider } = Layout;
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import './friend.css';
import useRoomStore from '../../store/roomStore';



// 好友列表组件
const PersonsPanel = () => {
    const currentRoom = useRoomStore(state => state.currentRoom);
    console.log(currentRoom)
    const onlineUsers = currentRoom?.users || [];
    return (
    <Sider
        width={240}
        style={{
            background: '#fff',
            borderLeft: '1px solid #e8e8e8'
        }}
    >
        <div style={{ padding: '16px' }}>
            <div ><TeamOutlined /> 在线{`-${onlineUsers.length}`}</div>
            <List
                dataSource={onlineUsers}
                renderItem={(item) => (
                    <List.Item className="friend-item" >
                        <Avatar icon={<UserOutlined />} src = {item.avatar} />
                        <span style={{ marginLeft: 8 }} className="friend-name">{item.username}</span>
                    </List.Item>
                )}
            />
        </div>
    </Sider>
);
}

export default PersonsPanel;