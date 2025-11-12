import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';

const seedCategories = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔄 Seeding categories...');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Check if categories already exist
    const existingCategories = await db.query.categories.findMany();

    if (existingCategories.length > 0) {
      console.log('⚠️  Categories already exist, skipping...');
      await client.end();
      return;
    }

    // Define default categories
    const categories = [
      {
        name: 'Artikel Iman',
        slug: 'artikel-iman',
        description: 'Artikel tentang iman Katolik, teologi, dan ajaran Gereja',
        displayOrder: 1,
      },
      {
        name: 'Liturgi',
        slug: 'liturgi',
        description: 'Artikel tentang liturgi, misa, dan perayaan Gereja',
        displayOrder: 2,
      },
      {
        name: 'Sakramen',
        slug: 'sakramen',
        description: 'Artikel tentang tujuh sakramen Gereja Katolik',
        displayOrder: 3,
      },
      {
        name: 'Doa dan Devosi',
        slug: 'doa-dan-devosi',
        description: 'Kumpulan doa dan devosi Katolik',
        displayOrder: 4,
      },
      {
        name: 'Santo dan Santa',
        slug: 'santo-dan-santa',
        description: 'Kisah hidup para santo dan santa Gereja Katolik',
        displayOrder: 5,
      },
      {
        name: 'Spiritualitas',
        slug: 'spiritualitas',
        description: 'Artikel tentang kehidupan rohani dan pertumbuhan iman',
        displayOrder: 6,
      },
      {
        name: 'Moral dan Etika',
        slug: 'moral-dan-etika',
        description: 'Ajaran moral dan etika Katolik',
        displayOrder: 7,
      },
      {
        name: 'Kitab Suci',
        slug: 'kitab-suci',
        description: 'Artikel tentang Alkitab dan studi Kitab Suci',
        displayOrder: 8,
      },
      {
        name: 'Sejarah Gereja',
        slug: 'sejarah-gereja',
        description: 'Sejarah Gereja Katolik dari awal hingga kini',
        displayOrder: 9,
      },
      {
        name: 'Dokumen Gereja',
        slug: 'dokumen-gereja',
        description: 'Dokumen resmi Gereja: ensiklik, konstitusi, dekrit, dll',
        displayOrder: 10,
      },
    ];

    // Insert categories
    await db.insert(schema.categories).values(categories);

    console.log(`✅ ${categories.length} categories created successfully!`);
    categories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await client.end();
  }
};

seedCategories()
  .then(() => {
    console.log('✅ Categories seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Categories seed failed:', error);
    process.exit(1);
  });
