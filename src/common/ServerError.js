import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function ServerError() {
    return (
        <div className="server-error-page">
            <h1 className="title">500</h1>
            <div className="desc">Üzgünüz! Bir şeyler yanlış gitti.</div>
            <Link to="/">
                <Button type="primary">Ana Sayfaya Dön</Button>
            </Link>
        </div>
    );
} 