import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, ilike, or } from 'drizzle-orm';
import * as schema from '@catholic-platform/database/schema';

const bible = new Hono();

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

/**
 * GET /bible/books
 * List all Bible books
 * Query params:
 *  - testament: filter by testament (old_testament, deuterocanonical, new_testament)
 *  - category: filter by category
 */
bible.get('/books', async (c) => {
  const { testament, category } = c.req.query();

  try {
    let books = await db.query.bibleBooks.findMany({
      orderBy: (books, { asc }) => [asc(books.bookNumber)],
    });

    // Filter by testament if provided
    if (testament) {
      books = books.filter((book) => book.testament === testament);
    }

    // Filter by category if provided
    if (category) {
      books = books.filter((book) => book.category === category);
    }

    return c.json({
      success: true,
      data: books,
      meta: {
        total: books.length,
        testament,
        category,
      },
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch Bible books',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /bible/books/:id
 * Get a specific book by ID with chapter count
 */
bible.get('/books/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json(
      {
        success: false,
        error: 'Invalid book ID',
      },
      400
    );
  }

  try {
    const book = await db.query.bibleBooks.findFirst({
      where: eq(schema.bibleBooks.id, id),
      with: {
        chapters: {
          orderBy: (chapters, { asc }) => [asc(chapters.chapterNumber)],
          columns: {
            id: true,
            chapterNumber: true,
            totalVerses: true,
          },
        },
      },
    });

    if (!book) {
      return c.json(
        {
          success: false,
          error: 'Book not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch book',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /bible/chapters/:id
 * Get a specific chapter with all verses
 */
bible.get('/chapters/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json(
      {
        success: false,
        error: 'Invalid chapter ID',
      },
      400
    );
  }

  try {
    const chapter = await db.query.bibleChapters.findFirst({
      where: eq(schema.bibleChapters.id, id),
      with: {
        book: {
          columns: {
            id: true,
            nameIndonesian: true,
            nameEnglish: true,
            abbreviation: true,
            testament: true,
          },
        },
        verses: {
          orderBy: (verses, { asc }) => [asc(verses.verseNumber)],
          with: {
            footnotes: true,
          },
        },
      },
    });

    if (!chapter) {
      return c.json(
        {
          success: false,
          error: 'Chapter not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: chapter,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch chapter',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /bible/verses/:id
 * Get a specific verse
 */
bible.get('/verses/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (isNaN(id)) {
    return c.json(
      {
        success: false,
        error: 'Invalid verse ID',
      },
      400
    );
  }

  try {
    const verse = await db.query.bibleVerses.findFirst({
      where: eq(schema.bibleVerses.id, id),
      with: {
        chapter: {
          with: {
            book: {
              columns: {
                id: true,
                nameIndonesian: true,
                abbreviation: true,
              },
            },
          },
        },
        footnotes: true,
      },
    });

    if (!verse) {
      return c.json(
        {
          success: false,
          error: 'Verse not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: verse,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Failed to fetch verse',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /bible/search
 * Search verses by text
 * Query params:
 *  - q: search query (required)
 *  - book_id: filter by book ID
 *  - testament: filter by testament
 *  - limit: number of results (default: 20, max: 100)
 */
bible.get('/search', async (c) => {
  const { q, book_id, testament, limit = '20' } = c.req.query();

  if (!q || q.trim().length < 3) {
    return c.json(
      {
        success: false,
        error: 'Search query must be at least 3 characters',
      },
      400
    );
  }

  const limitNum = Math.min(parseInt(limit) || 20, 100);

  try {
    // Build search query
    const searchQuery = db
      .select({
        verse: schema.bibleVerses,
        chapter: schema.bibleChapters,
        book: schema.bibleBooks,
      })
      .from(schema.bibleVerses)
      .innerJoin(schema.bibleChapters, eq(schema.bibleVerses.chapterId, schema.bibleChapters.id))
      .innerJoin(schema.bibleBooks, eq(schema.bibleChapters.bookId, schema.bibleBooks.id))
      .where(ilike(schema.bibleVerses.text, `%${q}%`))
      .limit(limitNum);

    // Add book filter if provided
    if (book_id) {
      const bookIdNum = parseInt(book_id);
      if (!isNaN(bookIdNum)) {
        searchQuery.where(eq(schema.bibleBooks.id, bookIdNum));
      }
    }

    // Add testament filter if provided
    if (testament) {
      searchQuery.where(eq(schema.bibleBooks.testament, testament as any));
    }

    const results = await searchQuery;

    // Format results
    const formatted = results.map((r) => ({
      verse: {
        id: r.verse.id,
        verseNumber: r.verse.verseNumber,
        text: r.verse.text,
      },
      chapter: {
        id: r.chapter.id,
        chapterNumber: r.chapter.chapterNumber,
      },
      book: {
        id: r.book.id,
        nameIndonesian: r.book.nameIndonesian,
        abbreviation: r.book.abbreviation,
        testament: r.book.testament,
      },
      reference: `${r.book.abbreviation} ${r.chapter.chapterNumber}:${r.verse.verseNumber}`,
    }));

    return c.json({
      success: true,
      data: formatted,
      meta: {
        total: formatted.length,
        query: q,
        book_id,
        testament,
        limit: limitNum,
      },
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: 'Search failed',
        message: error.message,
      },
      500
    );
  }
});

/**
 * GET /bible/daily
 * Get daily Mass readings (placeholder - requires liturgical calendar data)
 */
bible.get('/daily', async (c) => {
  const date = c.req.query('date') || new Date().toISOString().split('T')[0];

  return c.json({
    success: true,
    message: 'Daily readings endpoint - coming soon',
    data: {
      date,
      note: 'This endpoint requires liturgical calendar data to be imported',
    },
  });
});

export default bible;
