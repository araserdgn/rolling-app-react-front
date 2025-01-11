import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Layout, notification } from 'antd';
import AppHeader from '../common/AppHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import './App.css';
import NewPoll from '../poll/NewPoll';
import PollList from '../poll/PollList';
import Poll from '../poll/Poll';

const { Content } = Layout;

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadCurrentUser = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsLoading(false);
            setIsAuthenticated(false);
            return;
        }

        getCurrentUser()
            .then(response => {
                setCurrentUser(response);
                setIsAuthenticated(true);
            })
            .catch(error => {
                if (error.status === 401) {
                    setIsAuthenticated(false);
                    localStorage.removeItem(ACCESS_TOKEN);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

    const handleLogout = (redirectTo = "/", notificationType = "success", description = "Başarıyla çıkış yapıldı.") => {
        localStorage.removeItem(ACCESS_TOKEN);
        setCurrentUser(null);
        setIsAuthenticated(false);
        notification[notificationType]({
            message: 'Polling App',
            description: description,
        });
        navigate(redirectTo);
    };

    const handleLogin = () => {
        notification.success({
            message: 'Polling App',
            description: "Başarıyla giriş yapıldı.",
        });
        loadCurrentUser();
        navigate('/');
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Layout className="app-container">
            <AppHeader 
                isAuthenticated={isAuthenticated} 
                currentUser={currentUser} 
                onLogout={handleLogout} 
            />
            <Content className="app-content">
                <div className="container">
                    <Routes>
                        <Route path="/" element={
                            isAuthenticated ? (
                                <Navigate to="/polls" />
                            ) : (
                                <Navigate to="/login" />
                            )
                        } />
                        <Route path="/login" element={
                            <Login onLogin={handleLogin} />
                        } />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/users/:username" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/poll/new" element={
                            <PrivateRoute>
                                <NewPoll />
                            </PrivateRoute>
                        } />
                        <Route path="/polls" element={
                            <PrivateRoute>
                                <PollList currentUser={currentUser} />
                            </PrivateRoute>
                        } />
                        <Route path="/poll/:id" element={
                            <PrivateRoute>
                                <Poll />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Content>
        </Layout>
    );
}

export default App; 