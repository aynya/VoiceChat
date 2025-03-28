import React from 'react';
import { Layout } from 'antd';
import { useChannels } from '../../hooks/useChannels';
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import ChannelFooter from './ChannelFooter';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../hooks/useAuth';
import Right from '../rightMenu/Right';
const { Sider } = Layout;

const ChannelsPanel = () => {
    const { user } = useAuth();
    const {
        isCreating,
        currentStep,
        channelName,
        isInRoom,
        currentRoom,
        textChannels,
        voiceChannels,
        handleSetCurrentStep,
        setChannelName,
        handleChannelSelect,
        handleConfirm,
        handleCreate,
        handleCancel,
        handleNextStep,
        handleSelectType,
        handleExit,
        handleLogout,
        setCurrentRoom,
    } = useChannels(user);

    const { messages, loading, error, sendMessage, addMessage, updateMessage, deleteMessage, refreshMessages } = useMessages(currentRoom, user, setCurrentRoom);
    console.log(currentRoom?.key);
    console.log(currentRoom?.users);

    console.log("最上层的",currentRoom);

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
                <ChannelList
                    textChannels={textChannels}
                    voiceChannels={voiceChannels}
                    currentRoom={currentRoom}
                    onChannelSelect={handleChannelSelect}
                />

                <ChannelFooter
                    isInRoom={isInRoom}
                    currentRoom={currentRoom}
                    onCreate={handleCreate}
                    onExit={handleExit}
                    onLogout={handleLogout}
                />

                <CreateChannelModal
                    isCreating={isCreating}
                    currentStep={currentStep}
                    channelName={channelName}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    onNextStep={handleNextStep}
                    onSelectType={handleSelectType}
                    setChannelName={setChannelName}
                    onSetCurrentStep={handleSetCurrentStep}
                />
            </Sider>
            <Right 
                messages={messages} 
                loading={loading} 
                error={error} 
                sendMessage={sendMessage} 
                addMessage={addMessage} 
                updateMessage={updateMessage} 
                deleteMessage={deleteMessage} 
                refreshMessages={refreshMessages} 
                isInRoom={isInRoom}
                currentRoom={currentRoom}
 />
        </Layout>

    );
};

export default ChannelsPanel;