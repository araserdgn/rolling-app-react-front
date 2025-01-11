import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingIndicator() {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    
    return (
        <div className="loading-indicator">
            <Spin indicator={antIcon} />
        </div>
    );
} 