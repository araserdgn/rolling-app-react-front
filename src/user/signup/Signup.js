import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import { signup } from '../../util/APIUtils';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH,
    API_ERROR_MESSAGES
} from '../../constants';

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        signup(values)
            .then(response => {
                notification.success({
                    message: 'Kayıt Başarılı',
                    description: "Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz!",
                });
                navigate('/login');
            })
            .catch(error => {
                let errorMessage;
                if (error.status === 409) {
                    errorMessage = 'Bu kullanıcı adı veya email zaten kullanılıyor!';
                } else {
                    errorMessage = error.message || API_ERROR_MESSAGES.SERVER_ERROR;
                }
                notification.error({
                    message: 'Kayıt Başarısız',
                    description: errorMessage
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="signup-container">
            <h1 className="page-title">Kayıt Ol</h1>
            <Form
                form={form}
                name="signup"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="İsim"
                    rules={[
                        { required: true, message: 'Lütfen isminizi girin!' },
                        { min: NAME_MIN_LENGTH, message: `İsim en az ${NAME_MIN_LENGTH} karakter olmalıdır` },
                        { max: NAME_MAX_LENGTH, message: `İsim en fazla ${NAME_MAX_LENGTH} karakter olmalıdır` }
                    ]}
                >
                    <Input 
                        size="large"
                        placeholder="İsminizi girin"
                        maxLength={NAME_MAX_LENGTH}
                    />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Kullanıcı Adı"
                    rules={[
                        { required: true, message: 'Lütfen kullanıcı adınızı girin!' },
                        { min: USERNAME_MIN_LENGTH, message: `Kullanıcı adı en az ${USERNAME_MIN_LENGTH} karakter olmalıdır` },
                        { max: USERNAME_MAX_LENGTH, message: `Kullanıcı adı en fazla ${USERNAME_MAX_LENGTH} karakter olmalıdır` },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir' }
                    ]}
                >
                    <Input 
                        size="large"
                        placeholder="Kullanıcı adınızı girin"
                        maxLength={USERNAME_MAX_LENGTH}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Lütfen email adresinizi girin!' },
                        { type: 'email', message: 'Lütfen geçerli bir email adresi girin!' },
                        { max: EMAIL_MAX_LENGTH, message: `Email en fazla ${EMAIL_MAX_LENGTH} karakter olmalıdır` }
                    ]}
                >
                    <Input 
                        size="large"
                        placeholder="Email adresinizi girin"
                        maxLength={EMAIL_MAX_LENGTH}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Şifre"
                    rules={[
                        { required: true, message: 'Lütfen şifrenizi girin!' },
                        { min: PASSWORD_MIN_LENGTH, message: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır` },
                        { max: PASSWORD_MAX_LENGTH, message: `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olmalıdır` }
                    ]}
                >
                    <Input.Password 
                        size="large"
                        placeholder="Şifrenizi girin"
                        maxLength={PASSWORD_MAX_LENGTH}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="signup-form-button"
                        loading={loading}
                    >
                        Kayıt Ol
                    </Button>
                    Zaten hesabınız var mı? <Link to="/login">Şimdi giriş yapın!</Link>
                </Form.Item>
            </Form>
        </div>
    );
} 