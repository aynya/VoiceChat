import React, {useEffect} from 'react';
import { Layout } from 'antd';
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import ChannelFooter from './ChannelFooter';
import Right from '../rightMenu/Right';
import useSocketStore from '../../store/socketStore';
const { Sider } = Layout;


const ChannelsPanel = () => {
    const { initLocalAudioStream, setupSocketListeners } = useSocketStore();
    useEffect(() => {
        console.log('App组件加载');

        // 初始化本地音频流
        initLocalAudioStream();

        // 设置 Socket 监听器
        const cleanupSocketListeners = setupSocketListeners();

        return () => {
            cleanupSocketListeners(); // 清理监听器
        };
    }, []);

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

                <ChannelFooter />

                <CreateChannelModal />
            </Sider>
            <Right />
        </Layout>

    );
};

export default ChannelsPanel;