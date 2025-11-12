'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Typography,
  message,
  Card,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { contentsAPI, categoriesAPI } from '@/lib/api-client';

const { Title } = Typography;
const { TextArea } = Input;

interface Category {
  id: number;
  name: string;
}

function CreateContentForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.list();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await contentsAPI.create(values);
      message.success('Konten berhasil dibuat');
      router.push('/contents');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Gagal membuat konten';
      message.error(errorMessage);
      console.error('Error creating content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            Kembali
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Buat Konten Baru
          </Title>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 'draft',
              contentType: 'article',
            }}
          >
            <Form.Item
              label="Judul"
              name="title"
              rules={[
                { required: true, message: 'Judul wajib diisi' },
                { max: 500, message: 'Judul maksimal 500 karakter' },
              ]}
            >
              <Input placeholder="Masukkan judul konten" size="large" />
            </Form.Item>

            <Form.Item
              label="Tipe Konten"
              name="contentType"
              rules={[{ required: true, message: 'Tipe konten wajib dipilih' }]}
            >
              <Select size="large">
                <Select.Option value="article">Artikel</Select.Option>
                <Select.Option value="document">Dokumen</Select.Option>
                <Select.Option value="prayer">Doa</Select.Option>
                <Select.Option value="homily">Homili</Select.Option>
                <Select.Option value="qa">Tanya Jawab</Select.Option>
                <Select.Option value="page">Halaman</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Kategori" name="categoryId">
              <Select
                placeholder="Pilih kategori (opsional)"
                allowClear
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
              />
            </Form.Item>

            <Form.Item label="Ringkasan" name="excerpt">
              <TextArea
                rows={3}
                placeholder="Masukkan ringkasan konten (opsional)"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="Konten"
              name="body"
              rules={[{ required: true, message: 'Konten wajib diisi' }]}
            >
              <TextArea
                rows={15}
                placeholder="Masukkan isi konten"
                showCount
              />
            </Form.Item>

            <Form.Item label="URL Gambar Unggulan" name="featuredImageUrl">
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item label="Meta Title (SEO)" name="metaTitle">
              <Input placeholder="Judul untuk SEO (opsional)" maxLength={255} />
            </Form.Item>

            <Form.Item label="Meta Description (SEO)" name="metaDescription">
              <TextArea
                rows={2}
                placeholder="Deskripsi untuk SEO (opsional)"
                maxLength={300}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Status wajib dipilih' }]}
            >
              <Select size="large">
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="archived">Archived</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  Simpan Konten
                </Button>
                <Button size="large" onClick={() => router.back()}>
                  Batal
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </AdminLayout>
  );
}

export default function CreateContentPage() {
  return (
    <ProtectedRoute>
      <CreateContentForm />
    </ProtectedRoute>
  );
}
