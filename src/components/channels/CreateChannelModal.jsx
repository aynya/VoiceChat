import React from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';
import { ChannelStep, ChannelType } from './types';

const CreateChannelModal = ({
    isCreating,
    currentStep,
    channelName,
    onCancel,
    onConfirm,
    onNextStep,
    onSelectType,
    setChannelName,
    onSetCurrentStep,
}) => {
    // console.log(currentStep);
    return (
        <Modal
            open={isCreating}
            onCancel={onCancel}
            onOk={onConfirm}
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
                    <Button block onClick={onNextStep}>
                        创建频道
                    </Button>
                    <Button
                        block
                        onClick={() => {
                            onSelectType(ChannelType.TEXT);
                            onSetCurrentStep(ChannelStep.JOIN_NAME);
                        }}
                    >
                        加入频道
                    </Button>
                </Space>
            )}
            {currentStep === ChannelStep.CREATE_TYPE && (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block onClick={() => onSelectType(ChannelType.TEXT)}>
                        文字频道
                    </Button>
                    <Button block onClick={() => onSelectType(ChannelType.VOICE)}>
                        语音频道
                    </Button>
                </Space>
            )}
            {[ChannelStep.CREATE_NAME, ChannelStep.JOIN_NAME].includes(currentStep) && (
                <Form>
                    <Form.Item label="房间号">
                        <Input
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
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