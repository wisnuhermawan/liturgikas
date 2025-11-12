'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  message,
  Tag,
  Breadcrumb,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  BookOutlined,
} from '@ant-design/icons';
import PublicLayout from '@/components/PublicLayout';
import { bibleAPI } from '@/lib/api-client';

const { Title, Text, Paragraph } = Typography;

interface BibleVerse {
  id: number;
  verseNumber: number;
  text: string;
}

interface BibleChapter {
  id: number;
  chapterNumber: number;
  totalVerses: number;
  book: {
    id: number;
    nameIndonesian: string;
    nameEnglish: string;
    abbreviation: string;
    totalChapters: number;
  };
  verses: BibleVerse[];
}

export default function ChapterReaderPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;
  const chapterNumber = params.chapterNumber as string;

  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId && chapterNumber) {
      fetchChapter();
    }
  }, [bookId, chapterNumber]);

  const fetchChapter = async () => {
    setLoading(true);
    try {
      // First get the book to find the chapter ID
      const bookResponse = await bibleAPI.getBook(parseInt(bookId));
      const book = bookResponse.data.data;
      const chapterData = book.chapters?.find(
        (ch: any) => ch.chapterNumber === parseInt(chapterNumber)
      );

      if (!chapterData) {
        message.error('Bab tidak ditemukan');
        return;
      }

      // Then get the chapter with verses
      const chapterResponse = await bibleAPI.getChapter(chapterData.id);
      setChapter(chapterResponse.data.data);
    } catch (error) {
      message.error('Gagal memuat bab');
      console.error('Error fetching chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevChapter = () => {
    const prevChapter = parseInt(chapterNumber) - 1;
    if (prevChapter >= 1) {
      router.push(`/alkitab/${bookId}/${prevChapter}`);
    }
  };

  const handleNextChapter = () => {
    if (chapter) {
      const nextChapter = parseInt(chapterNumber) + 1;
      if (nextChapter <= chapter.book.totalChapters) {
        router.push(`/alkitab/${bookId}/${nextChapter}`);
      }
    }
  };

  const canGoPrev = parseInt(chapterNumber) > 1;
  const canGoNext = chapter && parseInt(chapterNumber) < chapter.book.totalChapters;

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Memuat..." />
        </div>
      </PublicLayout>
    );
  }

  if (!chapter) {
    return (
      <PublicLayout>
        <Card>
          <Text>Bab tidak ditemukan</Text>
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
              href: `/alkitab/${bookId}`,
              title: chapter.book.nameIndonesian,
            },
            {
              title: `Bab ${chapterNumber}`,
            },
          ]}
        />

        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push(`/alkitab/${bookId}`)}
            >
              Kembali ke Daftar Bab
            </Button>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handlePrevChapter}
                disabled={!canGoPrev}
              >
                Bab Sebelumnya
              </Button>
              <Button
                onClick={handleNextChapter}
                disabled={!canGoNext}
                type="primary"
              >
                Bab Selanjutnya
                <ArrowRightOutlined />
              </Button>
            </Space>
          </Col>
        </Row>

        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Space direction="vertical" size="small">
                <Tag color="blue">{chapter.book.abbreviation}</Tag>
                <Title level={1} style={{ marginBottom: 0 }}>
                  {chapter.book.nameIndonesian} {chapterNumber}
                </Title>
                <Text type="secondary">
                  {chapter.book.nameEnglish} Chapter {chapterNumber}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {chapter.totalVerses} ayat
                </Text>
              </Space>
            </div>

            <Divider />

            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {chapter.verses?.map((verse, index) => (
                <Paragraph
                  key={verse.id}
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: 14,
                      color: '#1890ff',
                      marginRight: 8,
                      verticalAlign: 'super',
                    }}
                  >
                    {verse.verseNumber}
                  </Text>
                  {verse.text}
                </Paragraph>
              ))}
            </div>

            <Divider />

            <Row justify="space-between" align="middle">
              <Col>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrevChapter}
                  disabled={!canGoPrev}
                  size="large"
                >
                  Bab {parseInt(chapterNumber) - 1}
                </Button>
              </Col>
              <Col>
                <Space direction="vertical" align="center" size="small">
                  <Text type="secondary">
                    Bab {chapterNumber} dari {chapter.book.totalChapters}
                  </Text>
                  <Button
                    type="link"
                    onClick={() => router.push(`/alkitab/${bookId}`)}
                  >
                    Lihat Semua Bab
                  </Button>
                </Space>
              </Col>
              <Col>
                <Button
                  onClick={handleNextChapter}
                  disabled={!canGoNext}
                  type="primary"
                  size="large"
                >
                  Bab {parseInt(chapterNumber) + 1}
                  <ArrowRightOutlined />
                </Button>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    </PublicLayout>
  );
}
