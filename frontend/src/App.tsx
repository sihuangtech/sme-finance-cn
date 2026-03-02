import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EnterpriseSelect from './pages/EnterpriseSelect';
import Dashboard from './pages/Dashboard';
import Bookkeeping from './pages/Bookkeeping';
import Invoices from './pages/Invoices';
import TaxFiling from './pages/TaxFiling';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';

const { Header, Sider, Content } = Layout;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const enterpriseId = localStorage.getItem('enterpriseId');
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;
  if (!enterpriseId && location.pathname !== '/enterprise-select') return <Navigate to="/enterprise-select" />;

  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '首页看板' },
    { key: '/bookkeeping', icon: <DollarOutlined />, label: '收支记账' },
    { key: '/invoices', icon: <FileTextOutlined />, label: '发票管理' },
    { key: '/tax', icon: <PieChartOutlined />, label: '税务申报' },
    { key: '/payroll', icon: <TeamOutlined />, label: '工资管理' },
    { key: '/reports', icon: <FileTextOutlined />, label: '财务报表' },
    { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)', textAlign: 'center', lineHeight: '32px' }}>
          {collapsed ? 'CF' : '小微财务软件'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ paddingRight: 24 }}>
            <span>测试企业 - 管理员</span>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/enterprise-select" element={
          <PrivateRoute>
            <EnterpriseSelect />
          </PrivateRoute>
        } />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bookkeeping" element={<Bookkeeping />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/tax" element={<TaxFiling />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<div>Settings</div>} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
