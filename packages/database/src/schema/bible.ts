import { integer, pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { bibleTestamentEnum } from './enums';

export const bibleBooks = pgTable(
  'bible_books',
  {
    id: serial('id').primaryKey(),
    bookNumber: integer('book_number').unique().notNull(),
    nameIndonesian: varchar('name_indonesian', { length: 100 }).notNull(),
    nameEnglish: varchar('name_english', { length: 100 }).notNull(),
    abbreviation: varchar('abbreviation', { length: 10 }).notNull(),
    testament: bibleTestamentEnum('testament').notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    totalChapters: integer('total_chapters').notNull(),
    author: varchar('author', { length: 255 }),
    writingPeriod: varchar('writing_period', { length: 100 }),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    testamentIdx: index('idx_bible_books_testament').on(table.testament),
    categoryIdx: index('idx_bible_books_category').on(table.category),
  })
);

export const bibleChapters = pgTable(
  'bible_chapters',
  {
    id: serial('id').primaryKey(),
    bookId: integer('book_id')
      .notNull()
      .references(() => bibleBooks.id, { onDelete: 'cascade' }),
    chapterNumber: integer('chapter_number').notNull(),
    totalVerses: integer('total_verses').notNull(),
    summary: text('summary'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    bookIdIdx: index('idx_bible_chapters_book_id').on(table.bookId),
  })
);

export const bibleVerses = pgTable(
  'bible_verses',
  {
    id: serial('id').primaryKey(),
    chapterId: integer('chapter_id')
      .notNull()
      .references(() => bibleChapters.id, { onDelete: 'cascade' }),
    verseNumber: integer('verse_number').notNull(),
    text: text('text').notNull(),
    searchVector: text('search_vector'), // tsvector as text
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    chapterIdIdx: index('idx_bible_verses_chapter_id').on(table.chapterId),
  })
);

export const bibleFootnotes = pgTable('bible_footnotes', {
  id: serial('id').primaryKey(),
  verseId: integer('verse_id')
    .notNull()
    .references(() => bibleVerses.id, { onDelete: 'cascade' }),
  footnoteNumber: integer('footnote_number').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const bibleCrossReferences = pgTable('bible_cross_references', {
  id: serial('id').primaryKey(),
  fromVerseId: integer('from_verse_id')
    .notNull()
    .references(() => bibleVerses.id, { onDelete: 'cascade' }),
  toVerseId: integer('to_verse_id')
    .notNull()
    .references(() => bibleVerses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relations
export const bibleBooksRelations = relations(bibleBooks, ({ many }) => ({
  chapters: many(bibleChapters),
}));

export const bibleChaptersRelations = relations(bibleChapters, ({ one, many }) => ({
  book: one(bibleBooks, {
    fields: [bibleChapters.bookId],
    references: [bibleBooks.id],
  }),
  verses: many(bibleVerses),
}));

export const bibleVersesRelations = relations(bibleVerses, ({ one, many }) => ({
  chapter: one(bibleChapters, {
    fields: [bibleVerses.chapterId],
    references: [bibleChapters.id],
  }),
  footnotes: many(bibleFootnotes),
  crossReferencesFrom: many(bibleCrossReferences, {
    relationName: 'from_verse',
  }),
  crossReferencesTo: many(bibleCrossReferences, {
    relationName: 'to_verse',
  }),
}));

export const bibleFootnotesRelations = relations(bibleFootnotes, ({ one }) => ({
  verse: one(bibleVerses, {
    fields: [bibleFootnotes.verseId],
    references: [bibleVerses.id],
  }),
}));

export const bibleCrossReferencesRelations = relations(bibleCrossReferences, ({ one }) => ({
  fromVerse: one(bibleVerses, {
    fields: [bibleCrossReferences.fromVerseId],
    references: [bibleVerses.id],
    relationName: 'from_verse',
  }),
  toVerse: one(bibleVerses, {
    fields: [bibleCrossReferences.toVerseId],
    references: [bibleVerses.id],
    relationName: 'to_verse',
  }),
}));
