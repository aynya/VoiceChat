import React from 'react';
import { Layout } from 'antd';
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import ChannelFooter from './ChannelFooter';
import Right from '../rightMenu/Right';
const { Sider } = Layout;

const ChannelsPanel = () => {
    return (
        <Layout hasSider style={{ height: '100vh' }}>
            <Sider
                width={240}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #e8e8e8',
                    height: '100vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <ChannelList />

                <ChannelFooter/>

                <CreateChannelModal />
            </Sider>
            <Right />
        </Layout>

    );
};

export default ChannelsPanel;