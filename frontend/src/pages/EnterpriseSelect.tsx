import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal, Form, Input, Select, message } from 'antd';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { EnterpriseType } from '@sme-finance/shared';

const EnterpriseSelect: React.FC = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEnterprises = async () => {
    try {
      const { data } = await api.get('/enterprises');
      setEnterprises(data);
    } catch (error) {
      message.error('获取企业列表失败');
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const selectEnterprise = (id: string) => {
    localStorage.setItem('enterpriseId', id);
    navigate('/');
  };

  const onCreate = async (values: any) => {
    try {
      await api.post('/enterprises', values);
      message.success('创建成功');
      setIsModalOpen(false);
      fetchEnterprises();
    } catch (error) {
      message.error('创建失败');
    }
  };

  return (
    <div style={{ padding: 50, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2>选择账套</h2>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>创建新企业</Button>
        </div>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={enterprises}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                hoverable
                title={item.name}
                onClick={() => selectEnterprise(item.id)}
                extra={item.userRole}
              >
                <p>税号: {item.taxId}</p>
                <p>类型: {item.type}</p>
              </Card>
            </List.Item>
          )}
        />
      </div>

      <Modal title="创建企业" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form onFinish={onCreate} layout="vertical">
          <Form.Item name="name" label="企业名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="企业类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={EnterpriseType.SOLE_PROPRIETOR}>个体工商户</Select.Option>
              <Select.Option value={EnterpriseType.SMALL_SCALE_TAXPAYER}>小规模纳税人</Select.Option>
              <Select.Option value={EnterpriseType.GENERAL_TAXPAYER}>一般纳税人</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="taxId" label="纳税人识别号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="province" label="省份" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="city" label="城市" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="industry" label="行业" rules={[{ required: true }]}><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>提交</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default EnterpriseSelect;
