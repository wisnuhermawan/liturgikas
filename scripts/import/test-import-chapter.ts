import 'dotenv/config';
import { BibleImporter } from './bible-importer';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';
import { eq } from 'drizzle-orm';

/**
 * Test Bible import with a single chapter
 * This will import Yohanes (John) chapter 3 as a test
 */

const testImport = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('🧪 Testing Bible import with Yohanes 3...\n');

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Find the book "Yohanes" (Gospel of John)
    const yohanes = await db.query.bibleBooks.findFirst({
      where: eq(schema.bibleBooks.abbreviation, 'Yoh'),
    });

    if (!yohanes) {
      throw new Error('Book "Yohanes" not found. Please run seed:bible-books first.');
    }

    console.log(`📖 Found book: ${yohanes.nameIndonesian} (ID: ${yohanes.id})`);
    console.log(`   Abbreviation: ${yohanes.abbreviation}`);
    console.log(`   Total chapters: ${yohanes.totalChapters}\n`);

    // Create importer instance
    const importer = new BibleImporter(connectionString);

    // Import chapters 1-3 (to test including the famous Yoh 3:16)
    console.log('📥 Importing chapters 1-3...\n');
    await importer.importBook(yohanes.id, yohanes.nameIndonesian, yohanes.abbreviation, 3);

    // Verify the import
    console.log('\n✅ Verifying import...');
    const chapters = await db.query.bibleChapters.findMany({
      where: eq(schema.bibleChapters.bookId, yohanes.id),
      with: {
        verses: true,
      },
    });

    if (chapters.length > 0) {
      console.log(`\n📊 Import Results: ${chapters.length} chapters imported`);
      for (const chapter of chapters) {
        console.log(`   Chapter ${chapter.chapterNumber}: ${chapter.verses.length} verses`);
      }

      // Show famous verse Yoh 3:16
      const chapter3 = chapters.find((c) => c.chapterNumber === 3);
      if (chapter3) {
        const verse16 = chapter3.verses.find((v) => v.verseNumber === 16);
        if (verse16) {
          console.log(`\n📖 Famous verse (Yoh 3:16):`);
          console.log(`   "${verse16.text}"`);
        }
      }
    } else {
      console.log('❌ No chapters found!');
    }

    await importer.close();
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await client.end();
  }
};

testImport()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
