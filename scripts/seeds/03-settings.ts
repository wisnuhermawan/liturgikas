import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';

const seedSettings = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔄 Seeding settings...');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Check if settings already exist
    const existingSettings = await db.query.settings.findMany();

    if (existingSettings.length > 0) {
      console.log('⚠️  Settings already exist, skipping...');
      await client.end();
      return;
    }

    // Define default settings
    const settings = [
      {
        key: 'site_name',
        value: 'Catholic Information Platform',
        description: 'Nama website',
        isPublic: true,
      },
      {
        key: 'site_description',
        value:
          'Platform informasi Katolik lengkap dengan Alkitab, Katekismus, Santo-Santa, dan konten Katolik lainnya',
        description: 'Deskripsi website',
        isPublic: true,
      },
      {
        key: 'site_tagline',
        value: 'Sumber Informasi Katolik Terpercaya',
        description: 'Tagline website',
        isPublic: true,
      },
      {
        key: 'contact_email',
        value: 'info@catholic-platform.com',
        description: 'Email kontak',
        isPublic: true,
      },
      {
        key: 'api_default_rate_limit',
        value: '1000',
        description: 'Default rate limit untuk API (requests per hour)',
        isPublic: false,
      },
      {
        key: 'max_upload_size',
        value: '5242880',
        description: 'Maksimal ukuran file upload (bytes) - 5MB',
        isPublic: false,
      },
      {
        key: 'allowed_file_types',
        value: 'image/jpeg,image/png,image/webp,application/pdf',
        description: 'Tipe file yang diperbolehkan untuk upload',
        isPublic: false,
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'Mode maintenance website',
        isPublic: false,
      },
      {
        key: 'enable_registration',
        value: 'false',
        description: 'Aktifkan registrasi user baru',
        isPublic: false,
      },
      {
        key: 'items_per_page',
        value: '20',
        description: 'Jumlah item per halaman untuk pagination',
        isPublic: true,
      },
    ];

    // Insert settings
    await db.insert(schema.settings).values(settings);

    console.log(`✅ ${settings.length} settings created successfully!`);
    settings.forEach((setting) => {
      console.log(`   - ${setting.key}: ${setting.value}`);
    });
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  } finally {
    await client.end();
  }
};

seedSettings()
  .then(() => {
    console.log('✅ Settings seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Settings seed failed:', error);
    process.exit(1);
  });
