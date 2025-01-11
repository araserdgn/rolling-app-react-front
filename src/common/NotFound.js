import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="page-not-found">
            <h1 className="title">404</h1>
            <div className="desc">Üzgünüz! Aradığınız sayfa bulunamadı.</div>
            <Link to="/">
                <Button type="primary">Ana Sayfaya Dön</Button>
            </Link>
        </div>
    );
} 