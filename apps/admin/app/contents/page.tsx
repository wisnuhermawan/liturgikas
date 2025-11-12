'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  Select,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { contentsAPI } from '@/lib/api-client';

const { Title } = Typography;
const { Search } = Input;

interface Content {
  id: string;
  title: string;
  contentType: string;
  status: string;
  category: { id: number; name: string } | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  createdByUser: {
    id: string;
    username: string;
    fullName: string | null;
  } | null;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function ContentsListContent() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    contentType: undefined as string | undefined,
    search: undefined as string | undefined,
  });

  const fetchContents = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await contentsAPI.list({
        page,
        limit: pagination.limit,
        ...filters,
      });

      setContents(response.data.data.contents);
      setPagination(response.data.data.pagination);
    } catch (error) {
      message.error('Gagal memuat daftar konten');
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents(1);
  }, [filters]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchContents(pagination.current || 1);
  };

  const handleDelete = async (id: string) => {
    try {
      await contentsAPI.delete(id);
      message.success('Konten berhasil dihapus');
      fetchContents(pagination.page);
    } catch (error) {
      message.error('Gagal menghapus konten');
      console.error('Error deleting content:', error);
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'published') {
        await contentsAPI.unpublish(id);
        message.success('Konten berhasil di-unpublish');
      } else {
        await contentsAPI.publish(id);
        message.success('Konten berhasil dipublikasikan');
      }
      fetchContents(pagination.page);
    } catch (error) {
      message.error('Gagal mengubah status konten');
      console.error('Error changing content status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'draft':
        return 'orange';
      case 'archived':
        return 'red';
      default:
        return 'default';
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      article: 'Artikel',
      document: 'Dokumen',
      prayer: 'Doa',
      homily: 'Homili',
      qa: 'Tanya Jawab',
      page: 'Halaman',
    };
    return labels[type] || type;
  };

  const columns: ColumnsType<Content> = [
    {
      title: 'Judul',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Tipe',
      dataIndex: 'contentType',
      key: 'contentType',
      width: 120,
      render: (type: string) => getContentTypeLabel(type),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: Content['category']) => category?.name || '-',
    },
    {
      title: 'Dibuat Oleh',
      dataIndex: 'createdByUser',
      key: 'createdBy',
      width: 150,
      render: (user: Content['createdByUser']) => user?.fullName || user?.username || '-',
    },
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      align: 'center',
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Content) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/contents/${record.id}`)}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/contents/${record.id}/edit`)}
          />
          <Button
            type="text"
            size="small"
            icon={record.status === 'published' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handlePublish(record.id, record.status)}
          />
          <Popconfirm
            title="Hapus konten?"
            description="Apakah Anda yakin ingin menghapus konten ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Manajemen Konten
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/contents/new')}
          >
            Buat Konten Baru
          </Button>
        </Col>
      </Row>

      <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Cari konten..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value || undefined }))
              }
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Tipe Konten"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilters((prev) => ({ ...prev, contentType: value }))}
              options={[
                { value: 'article', label: 'Artikel' },
                { value: 'document', label: 'Dokumen' },
                { value: 'prayer', label: 'Doa' },
                { value: 'homily', label: 'Homili' },
                { value: 'qa', label: 'Tanya Jawab' },
                { value: 'page', label: 'Halaman' },
              ]}
            />
          </Col>
        </Row>
      </Space>

      <Table
        columns={columns}
        dataSource={contents}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} konten`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1400 }}
      />
    </AdminLayout>
  );
}

export default function ContentsListPage() {
  return (
    <ProtectedRoute>
      <ContentsListContent />
    </ProtectedRoute>
  );
}
