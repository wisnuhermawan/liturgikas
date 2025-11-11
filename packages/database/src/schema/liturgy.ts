import { date, integer, pgTable, serial, text, timestamp, varchar, index } from 'drizzle-orm/pg-core';
import { liturgicalColorEnum, liturgicalRankEnum, liturgicalSeasonEnum } from './enums';
import { saints } from './saints';

export const liturgicalCalendar = pgTable(
  'liturgical_calendar',
  {
    id: serial('id').primaryKey(),
    date: date('date').unique().notNull(),
    season: liturgicalSeasonEnum('season').notNull(),
    week: integer('week'),
    weekday: integer('weekday').notNull(),
    color: liturgicalColorEnum('color').notNull(),
    rank: liturgicalRankEnum('rank').notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    readings: text('readings'), // JSONB as text
    psalm: text('psalm'),
    gospel: varchar('gospel', { length: 255 }),
    saintId: integer('saint_id').references(() => saints.id, { onDelete: 'set null' }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    dateIdx: index('idx_liturgical_calendar_date').on(table.date),
    seasonIdx: index('idx_liturgical_calendar_season').on(table.season),
    colorIdx: index('idx_liturgical_calendar_color').on(table.color),
  })
);
