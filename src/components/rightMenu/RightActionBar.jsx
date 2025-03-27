import React from 'react'
import { Tooltip, Button } from 'antd';
import { TeamOutlined, SearchOutlined } from '@ant-design/icons';




const RightActionBar = ({ onUserClick, onSearchClick }) => (
  <div style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 1000 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 4px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px 0 0 8px', boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)' }}>
      <Tooltip title="成员列表" placement="rightTop">
        <Button
          type="text"
          icon={<TeamOutlined />}
          onClick={onUserClick}
        />
      </Tooltip>
      <Tooltip title="搜索消息" placement="rightTop">
        <Button
          type="text"
          icon={<SearchOutlined />}
          onClick={onSearchClick}
        />
      </Tooltip>
    </div>
  </div>
);

export default RightActionBar