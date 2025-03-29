import React, { useState, useRef } from 'react'
import PersonsPanel from '../onlineUsers/PersonsPanel'
import RightActionBar from './RightActionBar';
import SearchPanel from './SearchPannel';
import TextChannel from '../chat/TextChannel'
import { Drawer, Button, List, Layout } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Right = () => {
    const [openUserPanel, setOpenUserPanel] = useState(false);
    const [openSearchPanel, setOpenSearchPanel] = useState(false);
    const messageListRef = useRef(null);

    const handleMessageJump = (messageId) => messageListRef.current.handleMessageJump(messageId);
    return (
        <Layout>
            <TextChannel ref={messageListRef}></TextChannel>
            {openUserPanel && <PersonsPanel ></PersonsPanel>}
            <div style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
                <RightActionBar
                    onUserClick={() => {
                        setOpenUserPanel(!openUserPanel);
                    }}
                    onSearchClick={() => {
                        setOpenSearchPanel(!openSearchPanel);
                    }}
                />
            </div>
            <Drawer
                title="消息搜索"
                placement="right"
                closable={false}
                onClose={() => setOpenSearchPanel(false)}
                open={openSearchPanel}
                width={320}
                mask={false}
                style={{ transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
                extra={
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setOpenSearchPanel(false)}
                    />
                }
            >
                <SearchPanel
                    onMessageClick={handleMessageJump}
                />
            </Drawer>
            {/* 消息列表项添加data属性 */}
        </Layout>
    )
}

export default Right