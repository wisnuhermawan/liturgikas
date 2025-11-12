'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  List,
  Tag,
  Spin,
  message,
  Space,
  Divider,
} from 'antd';
import { BookOutlined } from '@ant-design/icons';
import PublicLayout from '@/components/PublicLayout';
import { bibleAPI } from '@/lib/api-client';

const { Title, Text, Paragraph } = Typography;

interface BibleBook {
  id: number;
  bookNumber: number;
  nameIndonesian: string;
  nameEnglish: string;
  abbreviation: string;
  testament: string;
  category: string;
  totalChapters: number;
  author: string | null;
  writingPeriod: string | null;
}

export default function AlkitabPage() {
  const router = useRouter();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (testament?: string) => {
    setLoading(true);
    try {
      const response = await bibleAPI.getBooks(testament ? { testament } : undefined);
      setBooks(response.data.data);
    } catch (error) {
      message.error('Gagal memuat daftar kitab');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'all') {
      fetchBooks();
    } else {
      fetchBooks(key);
    }
  };

  const getTestamentLabel = (testament: string) => {
    const labels: Record<string, string> = {
      old_testament: 'Perjanjian Lama',
      new_testament: 'Perjanjian Baru',
      deuterocanonical: 'Deuterokanonika',
    };
    return labels[testament] || testament;
  };

  const groupBooksByCategory = (books: BibleBook[]) => {
    const grouped: Record<string, BibleBook[]> = {};
    books.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });
    return grouped;
  };

  const groupedBooks = groupBooksByCategory(books);

  const tabItems = [
    {
      key: 'all',
      label: 'Semua Kitab',
    },
    {
      key: 'old_testament',
      label: 'Perjanjian Lama',
    },
    {
      key: 'new_testament',
      label: 'Perjanjian Baru',
    },
  ];

  return (
    <PublicLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <BookOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={1} style={{ marginBottom: 8 }}>
            Alkitab Katolik
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
            73 kitab Alkitab Katolik lengkap dengan terjemahan Indonesia. Pilih kitab di bawah untuk
            mulai membaca.
          </Paragraph>
        </div>

        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            size="large"
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="Memuat daftar kitab..." />
            </div>
          ) : (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {Object.entries(groupedBooks).map(([category, categoryBooks]) => (
                <div key={category}>
                  <Divider orientation="left">
                    <Text strong style={{ fontSize: 16 }}>
                      {category}
                    </Text>
                  </Divider>
                  <Row gutter={[16, 16]}>
                    {categoryBooks.map((book) => (
                      <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                          hoverable
                          onClick={() => router.push(`/alkitab/${book.id}`)}
                          style={{ height: '100%' }}
                        >
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text strong style={{ fontSize: 16 }}>
                                {book.nameIndonesian}
                              </Text>
                              <Tag color="blue">{book.abbreviation}</Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {book.nameEnglish}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {book.totalChapters} bab
                            </Text>
                            {book.author && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Penulis: {book.author}
                              </Text>
                            )}
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Space>
          )}
        </Card>

        <Card title="Tentang Alkitab Katolik" style={{ marginTop: 24 }}>
          <Paragraph>
            Alkitab Katolik terdiri dari 73 kitab: 46 kitab dalam Perjanjian Lama dan 27 kitab dalam
            Perjanjian Baru. Perbedaan dengan Alkitab Protestan adalah Alkitab Katolik menyertakan 7
            kitab Deuterokanonika dalam Perjanjian Lama.
          </Paragraph>
          <Paragraph>
            <strong>Perjanjian Lama (46 kitab)</strong> berisi sejarah umat Allah Israel, hukum-hukum
            Musa, kitab-kitab puisi dan hikmat, serta nubuat para nabi.
          </Paragraph>
          <Paragraph>
            <strong>Perjanjian Baru (27 kitab)</strong> berisi kehidupan dan ajaran Yesus Kristus
            dalam Injil, sejarah Gereja perdana dalam Kisah Para Rasul, surat-surat para Rasul, dan
            kitab Wahyu.
          </Paragraph>
        </Card>
      </Space>
    </PublicLayout>
  );
}
