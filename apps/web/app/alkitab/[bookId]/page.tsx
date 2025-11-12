'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Spin,
  message,
  Tag,
  Breadcrumb,
} from 'antd';
import { ArrowLeftOutlined, HomeOutlined, BookOutlined } from '@ant-design/icons';
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
  description: string | null;
  chapters: Array<{
    id: number;
    chapterNumber: number;
    totalVerses: number;
  }>;
}

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<BibleBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await bibleAPI.getBook(parseInt(bookId));
      setBook(response.data.data);
    } catch (error) {
      message.error('Gagal memuat detail kitab');
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Memuat..." />
        </div>
      </PublicLayout>
    );
  }

  if (!book) {
    return (
      <PublicLayout>
        <Card>
          <Text>Kitab tidak ditemukan</Text>
        </Card>
      </PublicLayout>
    );
  }

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
              title: book.nameIndonesian,
            },
          ]}
        />

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/alkitab')}
        >
          Kembali ke Daftar Kitab
        </Button>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Space size="middle" style={{ marginBottom: 16 }}>
                <Tag color="blue">{book.abbreviation}</Tag>
                <Tag color="purple">{getTestamentLabel(book.testament)}</Tag>
                <Tag>{book.category}</Tag>
              </Space>
              <Title level={1} style={{ marginBottom: 8 }}>
                {book.nameIndonesian}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {book.nameEnglish}
              </Text>
            </div>

            {(book.author || book.writingPeriod) && (
              <div>
                {book.author && (
                  <Paragraph>
                    <Text strong>Penulis:</Text> {book.author}
                  </Paragraph>
                )}
                {book.writingPeriod && (
                  <Paragraph>
                    <Text strong>Periode Penulisan:</Text> {book.writingPeriod}
                  </Paragraph>
                )}
              </div>
            )}

            {book.description && (
              <Card type="inner" title="Tentang Kitab Ini">
                <Paragraph>{book.description}</Paragraph>
              </Card>
            )}

            <div>
              <Title level={3} style={{ marginBottom: 16 }}>
                Pilih Bab ({book.totalChapters} bab)
              </Title>
              <Row gutter={[12, 12]}>
                {book.chapters?.map((chapter) => (
                  <Col key={chapter.id} xs={6} sm={4} md={3} lg={2}>
                    <Button
                      block
                      size="large"
                      onClick={() =>
                        router.push(`/alkitab/${bookId}/${chapter.chapterNumber}`)
                      }
                      style={{ height: '60px' }}
                    >
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {chapter.chapterNumber}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          {chapter.totalVerses} ayat
                        </div>
                      </div>
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          </Space>
        </Card>
      </Space>
    </PublicLayout>
  );
}
