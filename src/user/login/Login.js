import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../util/APIUtils';
import { ACCESS_TOKEN, API_ERROR_MESSAGES } from '../../constants';

export default function Login({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const onFinish = (values) => {
        setLoading(true);
        login(values)
            .then(response => {
                if (response.accessToken) {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    notification.success({
                        message: 'Giriş Başarılı',
                        description: "Hoş geldiniz!",
                    });
                    onLogin();
                    
                    const { from } = location.state || { from: { pathname: "/" } };
                    navigate(from.pathname);
                } else {
                    throw new Error('Token alınamadı');
                }
            })
            .catch(error => {
                setLoading(false);
                let errorMessage;
                
                if (error.status === 401) {
                    errorMessage = 'Kullanıcı adı veya şifre hatalı!';
                    form.setFields([
                        {
                            name: 'password',
                            errors: ['Şifre hatalı']
                        }
                    ]);
                } else if (error.status === 404) {
                    errorMessage = 'Kullanıcı bulunamadı!';
                    form.setFields([
                        {
                            name: 'usernameOrEmail',
                            errors: ['Kullanıcı bulunamadı']
                        }
                    ]);
                } else {
                    errorMessage = error.message || API_ERROR_MESSAGES.SERVER_ERROR;
                }
                
                notification.error({
                    message: 'Giriş Başarısız',
                    description: errorMessage,
                    duration: 3
                });

                // Şifre alanını temizle
                form.setFields([
                    {
                        name: 'password',
                        value: ''
                    }
                ]);
            });
    };

    if (localStorage.getItem(ACCESS_TOKEN)) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">
            <h1 className="page-title">Giriş Yap</h1>
            <Form
                form={form}
                name="login"
                className="login-form"
                onFinish={onFinish}
                validateTrigger="onBlur"
            >
                <Form.Item
                    name="usernameOrEmail"
                    rules={[
                        { required: true, message: 'Lütfen kullanıcı adı veya email girin!' },
                        { whitespace: true, message: 'Boşluk karakteri ile başlayamaz' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        size="large"
                        placeholder="Kullanıcı Adı veya Email"
                        autoComplete="username"
                        maxLength={50}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Lütfen şifrenizi girin!' },
                        { whitespace: true, message: 'Boşluk karakteri ile başlayamaz' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        size="large"
                        placeholder="Şifre"
                        autoComplete="current-password"
                        maxLength={50}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="login-form-button"
                        loading={loading}
                    >
                        Giriş Yap
                    </Button>
                    Hesabınız yok mu? <Link to="/signup">Şimdi kaydolun!</Link>
                </Form.Item>
            </Form>
        </div>
    );
} 