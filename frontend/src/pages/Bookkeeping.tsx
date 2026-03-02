import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, message, Space, Card } from 'antd';
import api from '../services/api';
import { CATEGORIES, TransactionType } from '@sme-finance/shared';
import dayjs from 'dayjs';

const Bookkeeping: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (error) {
      message.error('获取交易列表失败');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await api.post('/transactions', {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      });
      message.success('记账成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchTransactions();
    } catch (error) {
      message.error('记账失败');
    }
  };

  const columns = [
    { title: '日期', dataKey: 'date', dataIndex: 'date' },
    {
      title: '类型',
      dataIndex: 'type',
      render: (t: string) => t === TransactionType.INCOME ? <span style={{color: 'green'}}>收入</span> : <span style={{color: 'red'}}>支出</span>
    },
    { title: '科目', dataIndex: 'category' },
    { title: '金额', dataIndex: 'amount', render: (a: number) => `¥${Number(a).toFixed(2)}` },
    { title: '备注', dataIndex: 'notes' },
  ];

  return (
    <Card title="收支明细" extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>新增记账</Button>}>
      <Table dataSource={transactions} columns={columns} rowKey="id" />

      <Modal title="新增记账" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true }]} initialValue={dayjs()}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={TransactionType.INCOME}>收入</Select.Option>
              <Select.Option value={TransactionType.EXPENSE}>支出</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => (
              <Form.Item name="category" label="科目" rules={[{ required: true }]}>
                <Select>
                  {(getFieldValue('type') === TransactionType.INCOME ? CATEGORIES.INCOME : CATEGORIES.EXPENSE).map(c => (
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea /></Form.Item>
          <Button type="primary" htmlType="submit" block>提交</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default Bookkeeping;
