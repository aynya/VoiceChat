import React, {useEffect} from 'react';
import { Layout } from 'antd';
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import ChannelFooter from './ChannelFooter';
import Right from '../rightMenu/Right';
import useSocketStore from '../../store/socketStore';
import useUserStore from '../../store/userStore';
import useLoginStore from '../../store/loginStore';
const { Sider } = Layout;


const ChannelsPanel = () => {
    const { initLocalAudioStream, setupSocketListeners, myId } = useSocketStore();
    const { setUser } = useUserStore();
    const { userInfo } = useLoginStore();
    useEffect(() => { // 初始化 本地音频流和 Socket 监听器
        console.log('App组件加载');

        // 初始化本地音频流
        initLocalAudioStream();

        // 设置 Socket 监听器
        const cleanupSocketListeners = setupSocketListeners();

        return () => {
            cleanupSocketListeners(); // 清理监听器
        };
    }, [initLocalAudioStream, setupSocketListeners]);

    useEffect(() => { // 设置用户信息
        setUser({
            id: myId,
            username: userInfo.nickname,
            avatar: userInfo.avatarUrl,
        })
        window.localStorage.setItem('loggedInUser', JSON.stringify(userInfo))
    }, [myId, setUser, userInfo])

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