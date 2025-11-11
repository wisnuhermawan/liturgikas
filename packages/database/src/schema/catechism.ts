import { integer, pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';

export const catechismParts = pgTable('catechism_parts', {
  id: serial('id').primaryKey(),
  partNumber: integer('part_number').unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const catechismSections = pgTable(
  'catechism_sections',
  {
    id: serial('id').primaryKey(),
    partId: integer('part_id')
      .notNull()
      .references(() => catechismParts.id, { onDelete: 'cascade' }),
    sectionNumber: integer('section_number').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    partIdIdx: index('idx_catechism_sections_part_id').on(table.partId),
  })
);

export const catechismChapters = pgTable(
  'catechism_chapters',
  {
    id: serial('id').primaryKey(),
    sectionId: integer('section_id')
      .notNull()
      .references(() => catechismSections.id, { onDelete: 'cascade' }),
    chapterNumber: integer('chapter_number').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    sectionIdIdx: index('idx_catechism_chapters_section_id').on(table.sectionId),
  })
);

export const catechismArticles = pgTable(
  'catechism_articles',
  {
    id: serial('id').primaryKey(),
    chapterId: integer('chapter_id')
      .notNull()
      .references(() => catechismChapters.id, { onDelete: 'cascade' }),
    articleNumber: integer('article_number').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    chapterIdIdx: index('idx_catechism_articles_chapter_id').on(table.chapterId),
  })
);

export const catechismParagraphs = pgTable(
  'catechism_paragraphs',
  {
    id: serial('id').primaryKey(),
    paragraphNumber: integer('paragraph_number').unique().notNull(),
    articleId: integer('article_id').references(() => catechismArticles.id, { onDelete: 'set null' }),
    text: text('text').notNull(),
    searchVector: text('search_vector'), // tsvector as text
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    paragraphNumberIdx: index('idx_catechism_paragraphs_paragraph_number').on(table.paragraphNumber),
    articleIdIdx: index('idx_catechism_paragraphs_article_id').on(table.articleId),
  })
);

export const catechismBibleReferences = pgTable('catechism_bible_references', {
  id: serial('id').primaryKey(),
  paragraphId: integer('paragraph_id')
    .notNull()
    .references(() => catechismParagraphs.id, { onDelete: 'cascade' }),
  reference: varchar('reference', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const catechismCrossReferences = pgTable('catechism_cross_references', {
  id: serial('id').primaryKey(),
  fromParagraphId: integer('from_paragraph_id')
    .notNull()
    .references(() => catechismParagraphs.id, { onDelete: 'cascade' }),
  toParagraphNumber: integer('to_paragraph_number').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
