import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any, action: 'login' | 'register') => {
    setLoading(true);
    try {
      const endpoint = action === 'login' ? '/login' : '/register';
      const { data } = await api.post(endpoint, values);

      if (action === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('登录成功');
        navigate('/enterprise-select');
      } else {
        message.success('注册成功，请登录');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="小微财务软件" style={{ width: 400 }}>
        <Tabs defaultActiveKey="login">
          <Tabs.TabPane tab="登录" key="login">
            <Form onFinish={(v) => onFinish(v, 'login')} layout="vertical">
              <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="注册" key="register">
            <Form onFinish={(v) => onFinish(v, 'register')} layout="vertical">
              <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>注册</Button>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
