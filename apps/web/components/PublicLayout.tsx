'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu, Button, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  ReadOutlined,
  HeartOutlined,
  CalendarOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Beranda</Link>,
    },
    {
      key: '/alkitab',
      icon: <BookOutlined />,
      label: <Link href="/alkitab">Alkitab</Link>,
    },
    {
      key: '/katekismus',
      icon: <ReadOutlined />,
      label: <Link href="/katekismus">Katekismus</Link>,
    },
    {
      key: '/santo-santa',
      icon: <HeartOutlined />,
      label: <Link href="/santo-santa">Santo & Santa</Link>,
    },
    {
      key: '/liturgi',
      icon: <CalendarOutlined />,
      label: <Link href="/liturgi">Kalender Liturgi</Link>,
    },
  ];

  // Find the active menu key based on pathname
  const getActiveKey = () => {
    if (pathname === '/') return '/';
    if (pathname.startsWith('/alkitab')) return '/alkitab';
    if (pathname.startsWith('/katekismus')) return '/katekismus';
    if (pathname.startsWith('/santo-santa')) return '/santo-santa';
    if (pathname.startsWith('/liturgi')) return '/liturgi';
    return '/';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#001529',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: 'bold',
            marginRight: '40px',
            whiteSpace: 'nowrap',
          }}
        >
          <Link href="/" style={{ color: '#fff' }}>
            Liturgi Kas
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
          }}
        />

        <Button
          type="text"
          icon={<SearchOutlined />}
          style={{ color: '#fff', marginLeft: 16 }}
        >
          Cari
        </Button>
      </Header>

      <Content style={{ padding: '24px 20px', minHeight: 'calc(100vh - 134px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>{children}</div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        <Text type="secondary">
          Liturgi Kas - Platform Informasi Katolik © 2025
        </Text>
      </Footer>
    </Layout>
  );
}
