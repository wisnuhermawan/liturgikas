import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catholic Information Platform',
  description: 'Platform informasi Katolik lengkap: Alkitab, Katekismus, Santo-Santa, dan lainnya',
};

const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    // Liturgical colors
    colorLiturgicalRed: '#cf1322',
    colorLiturgicalGreen: '#52c41a',
    colorLiturgicalPurple: '#722ed1',
    colorLiturgicalWhite: '#ffffff',
    colorLiturgicalRose: '#eb2f96',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontSize: 14,
    borderRadius: 6,
  },
  cssVar: true,
  hashed: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
