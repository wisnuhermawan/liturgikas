'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Typography,
  Input,
  Button,
  Space,
  List,
  Tag,
  Spin,
  message,
  Select,
  Row,
  Col,
  Empty,
  Breadcrumb,
} from 'antd';
import { SearchOutlined, HomeOutlined, BookOutlined } from '@ant-design/icons';
import PublicLayout from '@/components/PublicLayout';
import { bibleAPI } from '@/lib/api-client';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface SearchResult {
  id: number;
  verseNumber: number;
  text: string;
  chapter: {
    id: number;
    chapterNumber: number;
    book: {
      id: number;
      nameIndonesian: string;
      abbreviation: string;
    };
  };
}

export default function BibleSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [testament, setTestament] = useState<string | undefined>(undefined);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('Masukkan kata kunci pencarian');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await bibleAPI.search({
        q: value,
        testament,
        limit: 50,
      });
      setResults(response.data.data);

      if (response.data.data.length === 0) {
        message.info('Tidak ada hasil ditemukan');
      } else {
        message.success(`Ditemukan ${response.data.data.length} ayat`);
      }
    } catch (error) {
      message.error('Gagal melakukan pencarian');
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: '#ffc069', padding: '2px 4px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <PublicLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Breadcrumb
          items={[
            {
              href: '/',
              title: <HomeOutlined />,
            },
            {
              href: '/alkitab',
              title: (
                <>
                  <BookOutlined />
                  <span>Alkitab</span>
                </>
              ),
            },
            {
              title: 'Pencarian',
            },
          ]}
        />

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <SearchOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <Title level={2}>Cari Ayat Alkitab</Title>
              <Paragraph type="secondary">
                Temukan ayat-ayat dalam Alkitab dengan kata kunci tertentu
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col flex="auto">
                <Search
                  placeholder="Masukkan kata kunci (misal: kasih, iman, pengharapan)"
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />}>
                      Cari
                    </Button>
                  }
                  size="large"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                  loading={loading}
                />
              </Col>
              <Col>
                <Select
                  placeholder="Semua"
                  size="large"
                  style={{ width: 180 }}
                  value={testament}
                  onChange={setTestament}
                  options={[
                    { value: undefined, label: 'Semua Perjanjian' },
                    { value: 'old_testament', label: 'Perjanjian Lama' },
                    { value: 'new_testament', label: 'Perjanjian Baru' },
                  ]}
                />
              </Col>
            </Row>

            {loading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" tip="Mencari..." />
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <Empty
                description={
                  <Space direction="vertical">
                    <Text>Tidak ada hasil untuk "{searchQuery}"</Text>
                    <Text type="secondary">
                      Coba kata kunci lain atau periksa ejaan Anda
                    </Text>
                  </Space>
                }
              />
            )}

            {!loading && results.length > 0 && (
              <div>
                <Paragraph strong style={{ marginBottom: 16 }}>
                  Ditemukan {results.length} ayat untuk "{searchQuery}"
                </Paragraph>
                <List
                  dataSource={results}
                  renderItem={(item) => (
                    <List.Item
                      style={{ cursor: 'pointer', padding: '16px 0' }}
                      onClick={() =>
                        router.push(
                          `/alkitab/${item.chapter.book.id}/${item.chapter.chapterNumber}`
                        )
                      }
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Tag color="blue">{item.chapter.book.abbreviation}</Tag>
                            <Text strong>
                              {item.chapter.book.nameIndonesian} {item.chapter.chapterNumber}:
                              {item.verseNumber}
                            </Text>
                          </Space>
                        }
                        description={
                          <Paragraph
                            style={{
                              marginTop: 8,
                              fontSize: 15,
                              lineHeight: 1.6,
                            }}
                          >
                            {highlightText(item.text, searchQuery)}
                          </Paragraph>
                        }
                      />
                    </List.Item>
                  )}
                  style={{ maxHeight: '600px', overflow: 'auto' }}
                />
              </div>
            )}

            {!hasSearched && (
              <Card type="inner">
                <Title level={4}>Tips Pencarian:</Title>
                <ul>
                  <li>Gunakan kata kunci yang spesifik untuk hasil lebih akurat</li>
                  <li>Coba variasi kata yang berbeda jika tidak menemukan hasil</li>
                  <li>Gunakan filter Perjanjian untuk mempersempit pencarian</li>
                  <li>Klik hasil pencarian untuk membaca ayat lengkap dalam konteksnya</li>
                </ul>
              </Card>
            )}
          </Space>
        </Card>
      </Space>
    </PublicLayout>
  );
}
