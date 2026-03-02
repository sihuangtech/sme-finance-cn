import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Card, Space } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchInvoices = async () => {
    const { data } = await api.get('/invoices');
    setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleScan = async (qrString: string) => {
    try {
      const { data } = await api.post('/invoice/scan', { qrString });
      form.setFieldsValue({
        invoiceCode: data.invoiceCode,
        invoiceNumber: data.invoiceNumber,
        date: dayjs(data.date),
        amount: data.amount,
        checkCode: data.checkCode
      });
      message.success('解析成功');
    } catch (error) {
      message.error('解析失败，请检查格式');
    }
  };

  const onFinish = async (values: any) => {
    try {
      await api.post('/invoices', {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        taxAmount: values.amount * 0.01, // Example
        totalAmount: values.amount * 1.01,
        type: 'INPUT'
      });
      message.success('发票录入成功');
      setIsModalOpen(false);
      fetchInvoices();
    } catch (error) {
      message.error('录入失败');
    }
  };

  return (
    <Card title="发票管理" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>录入发票</Button>}>
      <Table
        dataSource={invoices}
        columns={[
          { title: '发票号码', dataIndex: 'invoiceNumber' },
          { title: '日期', dataIndex: 'date' },
          { title: '金额', dataIndex: 'amount' },
          { title: '类型', dataIndex: 'type' }
        ]}
        rowKey="id"
      />

      <Modal title="录入发票" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Search
            placeholder="粘贴发票二维码字符串进行扫描"
            enterButton="模拟扫描"
            onSearch={handleScan}
          />
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item name="invoiceCode" label="发票代码" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="invoiceNumber" label="发票号码" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="date" label="开票日期" rules={[{ required: true }]}><DatePicker style={{width:'100%'}}/></Form.Item>
            <Form.Item name="amount" label="不含税金额" rules={[{ required: true }]}><Input type="number" /></Form.Item>
            <Button type="primary" htmlType="submit" block>保存</Button>
          </Form>
        </Space>
      </Modal>
    </Card>
  );
};

export default Invoices;
