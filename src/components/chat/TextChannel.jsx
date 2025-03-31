import {
  Layout,
  Input,
  List,
  Avatar,
  Button,
  Space,
  Divider,
  Tag,
  Tooltip,
} from 'antd';
import {
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
const { Content } = Layout;
import './text.css'
import useRoomStore from '../../store/roomStore';
import useSocketStore from '../../store/socketStore';


// 消息组件
const MessageItem = ({ message }) => {
  return (
    <div style={{ display: 'flex', padding: '8px 0', alignItems: 'flex-start', overflowX: 'hidden', marginRight: '8px' }}>
      {/* Avatar 固定在左侧 */}
      <Avatar src={message.avatar} style={{ marginRight: '8px' }} />

      <div style={{ flex: 1, maxWidth: '70%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          {(
            <div style={{ fontWeight: 600, marginRight: '8px' }}>{message.username}</div>
          )}
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            {message.timestamp}
          </div>
        </div>

        {/* 消息内容透明背景，靠左对齐 */}
        <div style={{
          maxWidth: '70%',
          borderRadius: '12px',
          marginLeft: '0', // 固定左侧
          backgroundColor: 'transparent', // 透明背景
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap' // 保留换行符
        }}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

// 系统消息组件
const SystemMessage = ({ content }) => (
  <div style={{
    textAlign: 'center',
    padding: '8px 0',
    color: '#666'
  }}>
    <Tag color="default">{content}</Tag>
  </div>
);

// 主组件
const TextChannel = forwardRef((_, ref) => {
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef(null); // 新增ref
  const isInRoom = useRoomStore((state) => state.isInRoom);


  const messages = useSocketStore((state) => state.messages);
  const sendMessage = useSocketStore((state) => state.sendMessage);
  


  // 修改后的消息跳转处理
  const handleMessageJump = (messageId) => {
    const container = messageListRef.current;
    const targetElement = container.querySelector(`[data-message-id="${messageId}"]`);

    if (targetElement) {
      // 获取元素和容器的位置信息
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      
      // 计算相对偏移量（考虑反向滚动）
      const scrollOffset = elementRect.top - containerRect.top;
      const containerCenter = containerRect.height / 2;
      
      // 计算需要滚动的距离（考虑当前滚动位置）
      const targetScrollTop = container.scrollTop + scrollOffset - containerCenter;
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
  
      // 高亮逻辑保持不变
      targetElement.classList.add('highlight-message');
      setTimeout(() => targetElement.classList.remove('highlight-message'), 2000);
    }
  };
  useImperativeHandle(ref, () => ({
    handleMessageJump,
  }))

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };
  return (
    <Layout style={{ height: '100vh', backgroundColor: '#fff', color: '#fff' }}>
      {/* 消息列表区域 */}
      <Content
        ref={messageListRef}
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowX: 'hidden',
          position: 'relative' // 新增定位上下文
        }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            // 为每条消息添加唯一标识
            <div data-message-id={item.id} key={item.id}>
              {item.type === 'system' ? (
                <SystemMessage content={item.content} />
              ) : (
                <MessageItem
                  message={item}
                />
              )}
              {item.id === 2 && (
                <Divider orientation="center" style={{ fontSize: '0.8rem' }}>
                  今天
                </Divider>
              )}
            </div>
          )}
        />
      </Content>

      {/* 输入区域 */}
      {isInRoom && <div style={{
        position: 'sticky',
        bottom: 0,
        background: 'white',
        padding: '16px 16px',
        overflowX: 'hidden'
      }}>
        <Space.Compact block>
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 6 }}
            style={{ borderRadius: '20px', padding: '8px 16px' }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginLeft: '8px' }}>
            <Tooltip title="表情">
              <Button
                type="text"
                icon={<SmileOutlined />}
                style={{ color: '#666' }}
              />
            </Tooltip>

            <Tooltip title="上传文件">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                style={{ color: '#666' }}
              />
            </Tooltip>

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              style={{ borderRadius: '20px' }}
            />
          </div>
        </Space.Compact>
      </div>}
    </Layout>
  )
});

export default TextChannel;
