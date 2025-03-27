export const ChannelType = {
    TEXT: 'text',
    VOICE: 'voice'
};

export const ChannelStep = {
    SELECT_ACTION: 'selectAction',
    CREATE_TYPE: 'createType',
    CREATE_NAME: 'createName',
    JOIN_NAME: 'joinName'
};

export const defaultChannels = {
    text: [
        { key: 'general', label: '🛎️ 综合聊天' },
        { key: 'lounge', label: '🎮 临时代碼' }
    ],
    voice: [
        { key: 'voice-1', label: '🎧 语音频道 1' }
    ]
};

export const Channel = {
    key: '',
    label: '',
    type: ChannelType.TEXT
}; 