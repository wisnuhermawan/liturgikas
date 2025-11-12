import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../packages/database/src/schema';

/**
 * Bible Data Importer from imankatolik.or.id
 *
 * This script will:
 * 1. Fetch Bible data from imankatolik.or.id
 * 2. Parse HTML content
 * 3. Extract verses, footnotes, cross-references
 * 4. Store in database
 *
 * NOTE: Before running this script:
 * - Contact imankatolik.or.id for permission
 * - Be respectful with rate limiting
 * - Add delays between requests
 */

interface VerseData {
  verseNumber: number;
  text: string;
  footnotes?: string[];
  crossReferences?: string[];
}

interface ChapterData {
  chapterNumber: number;
  verses: VerseData[];
}

class BibleImporter {
  private db;
  private client;
  private baseUrl = 'https://www.imankatolik.or.id';
  private delay = 2000; // 2 seconds delay between requests

  constructor(connectionString: string) {
    this.client = postgres(connectionString);
    this.db = drizzle(this.client, { schema });
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchPage(url: string): Promise<string> {
    try {
      console.log(`📥 Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CatholicPlatformBot/1.0)',
        },
        timeout: 10000,
      });
      await this.sleep(this.delay); // Respectful delay
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error);
      throw error;
    }
  }

  private parseChapter(html: string, chapterNumber: number): ChapterData {
    const $ = cheerio.load(html);
    const verses: VerseData[] = [];

    // Parse HTML structure from imankatolik.or.id
    // Format: <table><tr><td class="v">Yoh 3:16</td><td class="v">verse text...</td></tr></table>
    $('table tr').each((index, element) => {
      const cells = $(element).find('td.v');

      if (cells.length === 2) {
        const reference = $(cells[0]).text().trim(); // e.g., "Yoh 3:16"
        const text = $(cells[1]).text().trim();

        // Extract verse number from reference (e.g., "3:16" -> 16)
        const verseMatch = reference.match(/:(\d+)$/);
        if (verseMatch && text) {
          const verseNum = parseInt(verseMatch[1]);
          verses.push({
            verseNumber: verseNum,
            text: text,
          });
        }
      }
    });

    return {
      chapterNumber,
      verses,
    };
  }

  async importBook(
    bookId: number,
    bookName: string,
    abbreviation: string,
    totalChapters: number
  ) {
    console.log(`\n📖 Importing ${bookName} (${totalChapters} chapters)...`);

    try {
      for (let chapterNum = 1; chapterNum <= totalChapters; chapterNum++) {
        console.log(`   📄 Chapter ${chapterNum}/${totalChapters}`);

        // URL Pattern: /alkitabq.php?q=[Book][Chapter]:[Start]-[End]
        // Example: /alkitabq.php?q=Yoh3:1-36 (for all verses in chapter 3)
        // We use 1-200 as range since no biblical chapter has more than 200 verses
        // (longest is Psalm 119 with 176 verses)
        const url = `${this.baseUrl}/alkitabq.php?q=${abbreviation}${chapterNum}:1-200`;

        try {
          const html = await this.fetchPage(url);
          const chapterData = this.parseChapter(html, chapterNum);

          // Insert chapter
          const [chapter] = await this.db
            .insert(schema.bibleChapters)
            .values({
              bookId,
              chapterNumber: chapterNum,
              totalVerses: chapterData.verses.length,
            })
            .returning();

          // Insert verses
          for (const verse of chapterData.verses) {
            await this.db.insert(schema.bibleVerses).values({
              chapterId: chapter.id,
              verseNumber: verse.verseNumber,
              text: verse.text,
            });
          }

          console.log(`      ✓ ${chapterData.verses.length} verses imported`);
        } catch (error) {
          console.error(`      ✗ Failed to import chapter ${chapterNum}:`, error);
          // Continue with next chapter
        }
      }

      console.log(`✅ ${bookName} import completed!`);
    } catch (error) {
      console.error(`❌ Error importing ${bookName}:`, error);
      throw error;
    }
  }

  async importAll() {
    console.log('🚀 Starting Bible import...\n');
    console.log('⚠️  IMPORTANT: Make sure you have permission from imankatolik.or.id');
    console.log('⏱️  This will take a long time (hours) due to rate limiting\n');

    try {
      // Get all books from database
      const books = await this.db.query.bibleBooks.findMany({
        orderBy: (books, { asc }) => [asc(books.bookNumber)],
      });

      console.log(`📚 Found ${books.length} books to import\n`);

      for (const book of books) {
        await this.importBook(
          book.id,
          book.nameIndonesian,
          book.abbreviation,
          book.totalChapters
        );
      }

      console.log('\n🎉 All books imported successfully!');
    } catch (error) {
      console.error('\n❌ Import failed:', error);
      throw error;
    } finally {
      await this.client.end();
    }
  }

  async close() {
    await this.client.end();
  }
}

// Main execution
const main = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const importer = new BibleImporter(connectionString);

  try {
    await importer.importAll();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  main();
}

export { BibleImporter };
