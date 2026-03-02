import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Card, Space, Divider } from 'antd';
import api from '../services/api';

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    const { data } = await api.get('/employees');
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onAddEmployee = async (values: any) => {
    try {
      await api.post('/employees', { ...values, joinDate: values.joinDate || '2024-01-01' });
      message.success('员工添加成功');
      setIsEmpModalOpen(false);
      fetchEmployees();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const onCalculateSalary = async (values: any) => {
    try {
      await api.post('/salaries', {
        ...values,
        employeeId: selectedEmployee.id,
        month: '2024-03'
      });
      message.success('工资结算成功');
      setIsSalaryModalOpen(false);
    } catch (error) {
      message.error('结算失败');
    }
  };

  return (
    <Card title="工资管理" extra={<Button type="primary" onClick={() => setIsEmpModalOpen(true)}>添加员工</Button>}>
      <Table
        dataSource={employees}
        columns={[
          { title: '姓名', dataIndex: 'name' },
          { title: '岗位', dataIndex: 'position' },
          { title: '基本工资', dataIndex: 'baseSalary' },
          {
            title: '操作',
            render: (_, record: any) => (
              <Button type="link" onClick={() => { setSelectedEmployee(record); setIsSalaryModalOpen(true); }}>结算本月工资</Button>
            )
          }
        ]}
        rowKey="id"
      />

      <Modal title="添加员工" open={isEmpModalOpen} onCancel={() => setIsEmpModalOpen(false)} footer={null}>
        <Form onFinish={onAddEmployee} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="idCardNumber" label="身份证号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="position" label="岗位" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="baseSalary" label="基本工资" rules={[{ required: true }]}><InputNumber style={{width:'100%'}}/></Form.Item>
          <Button type="primary" htmlType="submit" block>保存</Button>
        </Form>
      </Modal>

      <Modal title={`结算工资 - ${selectedEmployee?.name}`} open={isSalaryModalOpen} onCancel={() => setIsSalaryModalOpen(false)} footer={null}>
        <Form onFinish={onCalculateSalary} layout="vertical">
          <Form.Item name="performance" label="绩效/奖金"><InputNumber style={{width:'100%'}}/></Form.Item>
          <Form.Item name="personalSocialSecurity" label="个人社保扣款" rules={[{ required: true }]}><InputNumber style={{width:'100%'}}/></Form.Item>
          <Form.Item name="personalProvidentFund" label="个人公积金扣款" rules={[{ required: true }]}><InputNumber style={{width:'100%'}}/></Form.Item>
          <Divider />
          <p>个税起征点: 5000元</p>
          <Button type="primary" htmlType="submit" block>生成工资单</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default Payroll;
