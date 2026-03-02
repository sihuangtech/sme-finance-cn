import React, { useState } from 'react';
import { Card, Form, Select, Button, Descriptions, Space, Table, message, Divider } from 'antd';
import api from '../services/api';

const TaxFiling: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [taxResult, setTaxResult] = useState<any>(null);

  const onCalculate = async (values: any) => {
    setLoading(true);
    try {
      // For demo, we use the transactions from the backend to calculate
      // Real implementation would call a specialized endpoint or sum up on frontend
      const { data: txs } = await api.get('/transactions');

      const income = txs
        .filter((t: any) => t.type === 'INCOME')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      // Simple call to a hypothetical calculation endpoint or local logic
      // Using 1% VAT for demo
      const vat = income > 100000 ? income * 0.01 : 0;
      const surtax = vat * (0.07 + 0.03 + 0.02) * 0.5;

      setTaxResult({
        income,
        vat,
        surtax,
        total: vat + surtax
      });
    } catch (error) {
      message.error('计算失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="税务申报计算器 (小规模/个体户)">
      <Form layout="inline" onFinish={onCalculate} initialValues={{ period: '2024-Q1' }}>
        <Form.Item name="period" label="申报周期">
          <Select style={{ width: 120 }}>
            <Select.Option value="2024-Q1">2024 第一季度</Select.Option>
            <Select.Option value="2024-Q2">2024 第二季度</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>开始计算</Button>
      </Form>

      {taxResult && (
        <div style={{ marginTop: 24 }}>
          <Descriptions title="计算结果" bordered column={1}>
            <Descriptions.Item label="季度总收入">{taxResult.income.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="应纳增值税 (1%)">{taxResult.vat.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="附加税费 (减半征收)">{taxResult.surtax.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="总计应缴">{taxResult.total.toFixed(2)}</Descriptions.Item>
          </Descriptions>

          <Divider>申报截止提醒</Divider>
          <div style={{ color: 'red' }}>
            本期申报截止日期：2024-04-15 (剩余 15 天)
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaxFiling;
