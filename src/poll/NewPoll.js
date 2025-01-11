import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { createPoll } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import moment from 'moment';

export default function NewPoll() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values) => {
        const pollData = {
            question: values.question,
            choices: values.choices.map(choice => ({ text: choice })),
            expirationDateTime: values.expirationDateTime.toISOString()
        };

        setLoading(true);
        createPoll(pollData)
            .then(response => {
                notification.success({
                    message: 'Polling App',
                    description: "Anket başarıyla oluşturuldu!",
                });
                navigate('/polls');
            })
            .catch(error => {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Üzgünüz! Bir şeyler yanlış gitti. Lütfen tekrar deneyin!'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const disabledDate = (current) => {
        // Bugünden önceki tarihleri devre dışı bırak
        return current && current < moment().startOf('day');
    };

    return (
        <div className="new-poll-container">
            <h1 className="page-title">Yeni Anket Oluştur</h1>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    choices: ['', ''] // En az 2 seçenek
                }}
            >
                <Form.Item
                    name="question"
                    label="Soru"
                    rules={[
                        { required: true, message: 'Lütfen anket sorusunu girin!' },
                        { max: POLL_QUESTION_MAX_LENGTH, message: `Soru maksimum ${POLL_QUESTION_MAX_LENGTH} karakter olmalıdır` }
                    ]}
                >
                    <Input 
                        placeholder="Anket sorunuzu girin"
                        maxLength={POLL_QUESTION_MAX_LENGTH}
                    />
                </Form.Item>

                <Form.List
                    name="choices"
                    rules={[
                        {
                            validator: async (_, choices) => {
                                if (!choices || choices.length < 2) {
                                    return Promise.reject(new Error('En az 2 seçenek girmelisiniz!'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    required={false}
                                    key={field.key}
                                    label={index === 0 ? "Seçenekler" : ""}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Lütfen seçenek girin veya bu alanı silin",
                                            },
                                            {
                                                max: POLL_CHOICE_MAX_LENGTH,
                                                message: `Seçenek maksimum ${POLL_CHOICE_MAX_LENGTH} karakter olmalıdır`
                                            }
                                        ]}
                                        noStyle
                                    >
                                        <Input 
                                            placeholder={`Seçenek ${index + 1}`}
                                            style={{ width: '90%' }}
                                            maxLength={POLL_CHOICE_MAX_LENGTH}
                                        />
                                    </Form.Item>
                                    {fields.length > 2 && (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    )}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    disabled={fields.length >= MAX_CHOICES}
                                >
                                    Seçenek Ekle
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item
                    name="expirationDateTime"
                    label="Anket Bitiş Tarihi"
                    rules={[{ required: true, message: 'Lütfen anket bitiş tarihini seçin!' }]}
                >
                    <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm:ss"
                        disabledDate={disabledDate}
                        placeholder="Bitiş tarihini seçin"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        className="create-poll-form-button"
                    >
                        Anketi Oluştur
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
} 