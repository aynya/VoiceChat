import React from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';
import { ChannelStep, ChannelType } from './types';
import useRoomStore from '../../store/roomStore';

const CreateChannelModal = (
) => {
    const isCreating = useRoomStore((state) => state.isCreating);
    const currentStep = useRoomStore((state) => state.currentStep);
    const roomId = useRoomStore((state) => state.roomId);
    const handleCancel = useRoomStore((state) => state.handleCancel);
    const handleConfirm = useRoomStore((state) => state.handleConfirm);
    const handleNextStep = useRoomStore((state) => state.handleNextStep);
    const handleSelectType = useRoomStore((state) => state.handleSelectType);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const handleSetCurrentStep = useRoomStore((state) => state.handleSetCurrentStep);
    return (
        <Modal
            open={isCreating}
            onCancel={handleCancel}
            onOk={handleConfirm}
            okText={currentStep === ChannelStep.JOIN_NAME ? '加入' : '创建'}
            cancelText="取消"
            title={
                currentStep === ChannelStep.SELECT_ACTION
                    ? '选择操作'
                    : currentStep === ChannelStep.CREATE_TYPE
                        ? '选择频道类型'
                        : '创建/加入频道'
            }
        >
            {currentStep === ChannelStep.SELECT_ACTION && (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block onClick={handleNextStep}>
                        创建频道
                    </Button>
                    <Button
                        block
                        onClick={() => {
                            handleSelectType(ChannelType.TEXT);
                            handleSetCurrentStep(ChannelStep.JOIN_NAME);
                        }}
                    >
                        加入频道
                    </Button>
                </Space>
            )}
            {currentStep === ChannelStep.CREATE_TYPE && (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block onClick={() => handleSelectType(ChannelType.TEXT)}>
                        文字频道
                    </Button>
                    <Button block onClick={() => handleSelectType(ChannelType.VOICE)}>
                        语音频道
                    </Button>
                </Space>
            )}
            {[ChannelStep.CREATE_NAME, ChannelStep.JOIN_NAME].includes(currentStep) && (
                <Form>
                    <Form.Item label="房间号">
                        <Input
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="请输入房间号"
                            style={{
                                borderRadius: 4,
                                padding: '4px 8px',
                                border: '1px solid #d9d9d9',
                                transition: 'box-shadow 0.3s ease',
                                '&:focus': {
                                    borderColor: '#1677ff',
                                    boxShadow: '0 0 0 2px rgba(22, 119, 255, 0.2)'
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default CreateChannelModal; 