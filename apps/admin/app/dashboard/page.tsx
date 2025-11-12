'use client';

import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';

const { Title, Text } = Typography;

function DashboardContent() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">Selamat datang, {user?.fullName || user?.username}!</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bible Books"
              value={73}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Verses"
              value={31000}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="+"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              value={10}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={1}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Activity">
            <p>Sistem berjalan dengan baik</p>
            <p>✅ Database: Connected</p>
            <p>✅ API Server: Running on port 4000</p>
            <p>✅ Authentication: Active</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Links">
            <Button type="link" block style={{ textAlign: 'left' }}>
              📖 Manage Bible
            </Button>
            <Button type="link" block style={{ textAlign: 'left' }}>
              📝 Manage Content
            </Button>
            <Button type="link" block style={{ textAlign: 'left' }}>
              👤 Manage Users
            </Button>
            <Button type="link" block style={{ textAlign: 'left' }}>
              ⚙️ Settings
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }} title="User Information">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Username:</Text>
            <br />
            <Text>{user?.username}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text>
            <br />
            <Text>{user?.email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Role:</Text>
            <br />
            <Text>{user?.role}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Status:</Text>
            <br />
            <Text type="success">Active</Text>
          </Col>
        </Row>
      </Card>
    </AdminLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
