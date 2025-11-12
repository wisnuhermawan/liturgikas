'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/lib/auth-context';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: '/contents',
      icon: <FileTextOutlined />,
      label: 'Konten',
      onClick: () => router.push('/contents'),
    },
    {
      key: '/categories',
      icon: <FolderOutlined />,
      label: 'Kategori',
      onClick: () => router.push('/categories'),
    },
    {
      key: '/bible',
      icon: <BookOutlined />,
      label: 'Alkitab',
      onClick: () => router.push('/bible'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Pengguna',
      onClick: () => router.push('/users'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Pengaturan',
      onClick: () => router.push('/settings'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            color: '#fff',
            fontSize: collapsed ? '16px' : '18px',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'LK' : 'Liturgi Kas'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text strong>{user?.fullName || user?.username}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user?.role}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
