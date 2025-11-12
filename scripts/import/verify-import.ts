import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Verify imported Bible data
 */

const verify = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    console.log('🔍 Verifying imported Bible data...\n');

    // Get Yohanes book
    const yohanes = await db.query.bibleBooks.findFirst({
      where: eq(schema.bibleBooks.abbreviation, 'Yoh'),
    });

    if (!yohanes) {
      console.log('❌ Book "Yohanes" not found');
      return;
    }

    // Get chapter 3
    const chapter3 = await db.query.bibleChapters.findFirst({
      where: and(
        eq(schema.bibleChapters.bookId, yohanes.id),
        eq(schema.bibleChapters.chapterNumber, 3)
      ),
    });

    if (!chapter3) {
      console.log('❌ Chapter 3 not found');
      return;
    }

    console.log(`📖 Book: ${yohanes.nameIndonesian}`);
    console.log(`📄 Chapter 3 (ID: ${chapter3.id})`);
    console.log(`📊 Total verses in chapter: ${chapter3.totalVerses}\n`);

    // Get verse 16
    const verse16 = await db.query.bibleVerses.findFirst({
      where: and(
        eq(schema.bibleVerses.chapterId, chapter3.id),
        eq(schema.bibleVerses.verseNumber, 16)
      ),
    });

    if (verse16) {
      console.log('✅ Famous verse Yoh 3:16 found!');
      console.log(`\n"${verse16.text}"\n`);
    } else {
      console.log('❌ Verse 16 not found');
    }

    // Show first 3 verses
    const firstVerses = await db
      .select()
      .from(schema.bibleVerses)
      .where(eq(schema.bibleVerses.chapterId, chapter3.id))
      .orderBy(schema.bibleVerses.verseNumber)
      .limit(3);

    console.log('📖 First 3 verses:');
    for (const verse of firstVerses) {
      const preview = verse.text.substring(0, 100);
      console.log(`   ${verse.verseNumber}. ${preview}${verse.text.length > 100 ? '...' : ''}`);
    }

    // Count all imported data
    const totalBooks = await db
      .select({ count: schema.bibleBooks.id })
      .from(schema.bibleBooks);
    const totalChapters = await db
      .select({ count: schema.bibleChapters.id })
      .from(schema.bibleChapters);
    const totalVerses = await db
      .select({ count: schema.bibleVerses.id })
      .from(schema.bibleVerses);

    console.log(`\n📊 Database Statistics:`);
    console.log(`   Books: ${totalBooks.length}`);
    console.log(`   Chapters: ${totalChapters.length}`);
    console.log(`   Verses: ${totalVerses.length}`);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await client.end();
  }
};

verify()
  .then(() => {
    console.log('\n✅ Verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
