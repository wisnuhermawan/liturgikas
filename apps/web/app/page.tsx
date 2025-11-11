import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { BookOutlined, ReadOutlined, HeartOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ color: 'white', fontSize: 48, marginBottom: 16 }}>
          Platform Informasi Katolik
        </Title>
        <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          Akses lengkap Alkitab, Katekismus, Santo-Santa, Kalender Liturgi, dan berbagai konten
          Katolik lainnya
        </Paragraph>
        <Space size="large" style={{ marginTop: 32 }}>
          <Button type="primary" size="large" ghost>
            Jelajahi Sekarang
          </Button>
          <Button size="large" style={{ background: 'white', color: '#667eea' }}>
            Tentang Kami
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
          Fitur Utama
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px 0', background: '#f6ffed' }}>
                  <BookOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                </div>
              }
            >
              <Title level={4}>Alkitab</Title>
              <Paragraph>73 kitab lengkap dengan terjemahan Indonesia dan fitur pencarian</Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px 0', background: '#e6f7ff' }}>
                  <ReadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
              }
            >
              <Title level={4}>Katekismus</Title>
              <Paragraph>2,865 paragraf Katekismus Gereja Katolik lengkap dan terstruktur</Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px 0', background: '#fff1f0' }}>
                  <HeartOutlined style={{ fontSize: 48, color: '#f5222d' }} />
                </div>
              }
            >
              <Title level={4}>Santo & Santa</Title>
              <Paragraph>Profil lengkap santo dan santa dengan hari perayaannya</Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              cover={
                <div style={{ padding: '40px 0', background: '#f9f0ff' }}>
                  <CalendarOutlined style={{ fontSize: 48, color: '#722ed1' }} />
                </div>
              }
            >
              <Title level={4}>Kalender Liturgi</Title>
              <Paragraph>Kalender liturgi lengkap dengan bacaan harian</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <div
        style={{
          background: '#001529',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
          marginTop: 80,
        }}
      >
        <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
          Catholic Information Platform © 2025 | Built with Next.js 15 & Ant Design 5.22
        </Paragraph>
      </div>
    </div>
  );
}
