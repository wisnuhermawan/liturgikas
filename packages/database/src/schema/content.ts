import { boolean, integer, pgTable, serial, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { contentStatusEnum, contentTypeEnum, documentTypeEnum } from './enums';
import { users } from './users';

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).unique().notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    description: text('description'),
    parentId: integer('parent_id'),
    displayOrder: integer('display_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    slugIdx: index('idx_categories_slug').on(table.slug),
    parentIdIdx: index('idx_categories_parent_id').on(table.parentId),
  })
);

export const tags = pgTable(
  'tags',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).unique().notNull(),
    slug: varchar('slug', { length: 50 }).unique().notNull(),
    usageCount: integer('usage_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    slugIdx: index('idx_tags_slug').on(table.slug),
  })
);

export const contents = pgTable(
  'contents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).unique().notNull(),
    excerpt: text('excerpt'),
    body: text('body').notNull(),
    contentType: contentTypeEnum('content_type').notNull(),
    status: contentStatusEnum('status').default('draft').notNull(),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    featuredImageUrl: varchar('featured_image_url', { length: 500 }),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    viewCount: integer('view_count').default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    searchVector: text('search_vector'), // tsvector as text
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  },
  (table) => ({
    slugIdx: index('idx_contents_slug').on(table.slug),
    contentTypeIdx: index('idx_contents_content_type').on(table.contentType),
    statusIdx: index('idx_contents_status').on(table.status),
    categoryIdIdx: index('idx_contents_category_id').on(table.categoryId),
    publishedAtIdx: index('idx_contents_published_at').on(table.publishedAt),
  })
);

export const contentTags = pgTable(
  'content_tags',
  {
    contentId: uuid('content_id')
      .notNull()
      .references(() => contents.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    contentIdIdx: index('idx_content_tags_content_id').on(table.contentId),
    tagIdIdx: index('idx_content_tags_tag_id').on(table.tagId),
  })
);

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contentId: uuid('content_id')
      .unique()
      .notNull()
      .references(() => contents.id, { onDelete: 'cascade' }),
    documentType: documentTypeEnum('document_type').notNull(),
    author: varchar('author', { length: 255 }),
    publicationDate: timestamp('publication_date', { withTimezone: true }),
    documentNumber: varchar('document_number', { length: 100 }),
    externalUrl: varchar('external_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    documentTypeIdx: index('idx_documents_document_type').on(table.documentType),
  })
);

export const prayers = pgTable(
  'prayers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contentId: uuid('content_id')
      .unique()
      .notNull()
      .references(() => contents.id, { onDelete: 'cascade' }),
    latinText: text('latin_text'),
    isTraditional: boolean('is_traditional').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  }
);

export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    filename: varchar('filename', { length: 255 }).notNull(),
    originalFilename: varchar('original_filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    fileSize: integer('file_size').notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    alt: varchar('alt', { length: 255 }),
    caption: text('caption'),
    uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    filenameIdx: index('idx_media_filename').on(table.filename),
    uploadedByIdx: index('idx_media_uploaded_by').on(table.uploadedBy),
  })
);
