import { Button, Card, Space, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: '90%',
          textAlign: 'center',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              Catholic Platform
            </Title>
            <Paragraph type="secondary">Admin Panel</Paragraph>
          </div>

          <Paragraph>
            Sistem manajemen konten untuk platform informasi Katolik. Kelola Alkitab, Katekismus,
            Santo-Santa, dan konten lainnya.
          </Paragraph>

          <Button type="primary" size="large" icon={<LoginOutlined />} href="/login" block>
            Login ke Admin Panel
          </Button>

          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Version 1.0.0 - Built with Next.js 15 & Ant Design 5.22
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}
