import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function AppHeader({ currentUser, isAuthenticated, onLogout }) {
    const navigate = useNavigate();

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            onLogout();
        }
    };

    let menuItems;
    if (isAuthenticated) {
        menuItems = [
            {
                key: 'home',
                icon: <HomeOutlined />,
                label: <Link to="/polls">Ana Sayfa</Link>
            },
            {
                key: 'newPoll',
                icon: <PlusOutlined />,
                label: <Link to="/poll/new">Yeni Anket</Link>
            },
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: <Link to={`/users/${currentUser.username}`}>Profil</Link>
            },
            {
                key: 'logout',
                label: 'Çıkış Yap'
            }
        ];
    } else {
        menuItems = [
            {
                key: 'login',
                label: <Link to="/login">Giriş Yap</Link>
            },
            {
                key: 'signup',
                label: <Link to="/signup">Kayıt Ol</Link>
            }
        ];
    }

    return (
        <Header className="app-header">
            <div className="container">
                <div className="app-title">
                    <Link to="/">Polling App</Link>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[]}
                    onClick={handleMenuClick}
                    items={menuItems}
                    className="app-menu"
                />
            </div>
        </Header>
    );
} 