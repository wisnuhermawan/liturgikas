import { date, integer, pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';

export const saints = pgTable(
  'saints',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }),
    feastDay: date('feast_day').notNull(),
    birthYear: integer('birth_year'),
    deathYear: integer('death_year'),
    biography: text('biography').notNull(),
    patronage: text('patronage'),
    symbols: text('symbols'),
    imageUrl: varchar('image_url', { length: 500 }),
    searchVector: text('search_vector'), // tsvector as text
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    feastDayIdx: index('idx_saints_feast_day').on(table.feastDay),
  })
);
