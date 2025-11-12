import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';
import { bibleBooks } from '../data/bible-books';

const seedBibleBooks = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🔄 Seeding Bible books...');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Check if Bible books already exist
    const existingBooks = await db.query.bibleBooks.findMany();

    if (existingBooks.length > 0) {
      console.log('⚠️  Bible books already exist, skipping...');
      await client.end();
      return;
    }

    // Insert Bible books
    await db.insert(schema.bibleBooks).values(bibleBooks);

    console.log(`✅ ${bibleBooks.length} Bible books created successfully!`);
    console.log('\n📊 Summary:');
    console.log(`   - Old Testament: ${bibleBooks.filter((b) => b.testament === 'old_testament').length} books`);
    console.log(`   - Deuterocanonical: ${bibleBooks.filter((b) => b.testament === 'deuterocanonical').length} books`);
    console.log(`   - New Testament: ${bibleBooks.filter((b) => b.testament === 'new_testament').length} books`);
    console.log(`   - Total Chapters: ${bibleBooks.reduce((sum, b) => sum + b.totalChapters, 0)}`);
  } catch (error) {
    console.error('❌ Error seeding Bible books:', error);
    throw error;
  } finally {
    await client.end();
  }
};

seedBibleBooks()
  .then(() => {
    console.log('✅ Bible books seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Bible books seed failed:', error);
    process.exit(1);
  });
