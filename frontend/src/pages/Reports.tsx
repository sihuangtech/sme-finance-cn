import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, DatePicker, Button, Space, message } from 'antd';
import api from '../services/api';
import dayjs from 'dayjs';

const Reports: React.FC = () => {
  const [plData, setPlData] = useState<any>(null);
  const [bsData, setBsData] = useState<any>(null);

  const fetchReports = async () => {
    try {
      const [pl, bs] = await Promise.all([
        api.get('/reports/profit-loss', { params: { startDate: '2024-01-01', endDate: '2024-12-31' } }),
        api.get('/reports/balance-sheet', { params: { date: '2024-12-31' } })
      ]);
      setPlData(pl.data);
      setBsData(bs.data);
    } catch (error) {
      message.error('加载报表失败');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const plColumns = [
    { title: '项目', dataIndex: 'item' },
    { title: '金额', dataIndex: 'amount' },
  ];

  const plRows = plData ? [
    { key: '1', item: '营业收入', amount: plData.income.toFixed(2) },
    { key: '2', item: '减：营业成本/费用', amount: plData.expense.toFixed(2) },
    { key: '3', item: '利润总额', amount: plData.profit.toFixed(2) },
  ] : [];

  return (
    <Card title="财务报表" extra={<Button onClick={() => window.print()}>导出 PDF</Button>}>
      <Tabs defaultActiveKey="pl">
        <Tabs.TabPane tab="利润表" key="pl">
          <Table dataSource={plRows} columns={plColumns} pagination={false} bordered />
        </Tabs.TabPane>
        <Tabs.TabPane tab="资产负债表" key="bs">
          <div style={{ display: 'flex', gap: '20px' }}>
            <Table
              style={{ flex: 1 }}
              title={() => '资产'}
              dataSource={[{ item: '流动资产(现金)', amount: bsData?.assets?.cash?.toFixed(2) }]}
              columns={plColumns}
              pagination={false}
              bordered
            />
            <Table
              style={{ flex: 1 }}
              title={() => '负债及所有者权益'}
              dataSource={[
                { item: '流动负债', amount: '0.00' },
                { item: '所有者权益(盈余公积)', amount: bsData?.equity?.retainedEarnings?.toFixed(2) }
              ]}
              columns={plColumns}
              pagination={false}
              bordered
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Reports;
