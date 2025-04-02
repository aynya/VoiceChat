import React, { useState, useRef } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLoginStore from '../../store/loginStore';
import { login as loginService, register as registerService } from '../../services/loginService';

const LoginPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setLoggedIn } = useLoginStore();
    const [form] = Form.useForm();

    const registerFormRef = useRef(null);

    const handleLogin = async () => {
        try {
            const { token, user } = await loginService(username, password);
            localStorage.setItem('token', token); // 存储 token
            setLoggedIn(user); // 更新登录状态
            message.success('登录成功！');
        } catch (error) {
            message.error('登录失败，请检查用户名和密码！');
            console.error(error);
        }
    };

    const handleRegister = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const validateConfirmPassword = (_, value) => {
        const password = form.getFieldValue('password');
        if (value && value !== password) {
            return Promise.reject(new Error('两次输入的密码不一致！'));
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        try {
            const { nickname, password, confirmPassword, avatar } = values;
            if (password !== confirmPassword) {
                message.error('两次输入的密码不一致！');
                return;
            }

            const result = await registerService(nickname, password, confirmPassword, avatar);
            message.success(result.message || '注册成功！');
            // 注册成功后清空表单
            if (registerFormRef.current) {
                registerFormRef.current.resetFields();
            }
            setIsModalVisible(false);
        } catch (error) {
            message.error(error.message);
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>欢迎来到 VoooiceChat</h1>
                <Form onFinish={handleLogin}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" onChange={(e) => setUsername(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                        <Button onClick={handleRegister} style={{ marginLeft: '10px' }}>
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal
                title="注册"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" form="registerForm" htmlType="submit">
                        注册
                    </Button>,
                ]}
            >
                <Form id="registerForm" ref={registerFormRef} form={form} onFinish={onFinish}>
                    {/* 昵称 */}
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        hasFeedback
                        rules={[
                            { required: true, message: '请输入昵称!' },
                            { min: 1, max: 8, message: '昵称长度必须在 1 到 8 个字符之间!' },
                            { pattern: /^[a-zA-Z0-9]+$/, message: '昵称只能包含字母和数字!' },
                        ]}
                    >
                        <Input placeholder="昵称" />
                    </Form.Item>

                    {/* 密码 */}
                    <Form.Item
                        name="password"
                        label="密码"
                        hasFeedback
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 6, max: 12, message: '密码长度必须在 6 到 12 个字符之间!' },
                            { pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/, message: '密码必须是字母和数字的组合!' },
                        ]}
                    >
                        <Input.Password placeholder="密码" />
                    </Form.Item>

                    {/* 确认密码 */}
                    <Form.Item
                        name="confirmPassword"
                        label="确认密码"
                        dependencies={['password']} // 依赖于密码字段
                        hasFeedback
                        rules={[
                            { required: true, message: '请再次输入密码!' },
                            { validator: validateConfirmPassword }, // 自定义校验规则
                        ]}
                    >
                        <Input.Password placeholder="确认密码" />
                    </Form.Item>

                    {/* 头像 URL */}
                    <Form.Item
                        name="avatar"
                        label="头像 URL"
                        hasFeedback
                        rules={[
                            { required: true, message: '请输入图片 URL!' },
                            {
                                validator: (_, value) =>
                                    value && value.startsWith('http')
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('请输入有效的图片 URL')),
                            },
                        ]}
                    >
                        <Input placeholder="图片 URL" />
                    </Form.Item>

                    {/* 头像预览 */}
                    <Form.Item shouldUpdate>
                        {({ getFieldValue }) => {
                            const imageUrl = getFieldValue('avatar');
                            return imageUrl && imageUrl.startsWith('http') ? (
                                <img
                                    src={imageUrl}
                                    alt="预览"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                    }}
                                />
                            ) : null;
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LoginPage;