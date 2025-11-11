import { pgEnum } from 'drizzle-orm/pg-core';

// User roles
export const userRoleEnum = pgEnum('user_role', ['admin', 'content_manager', 'viewer']);

// User status
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'inactive']);

// Content status
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);

// Content type
export const contentTypeEnum = pgEnum('content_type', [
  'article',
  'document',
  'prayer',
  'homily',
  'qa',
  'page',
]);

// Document type
export const documentTypeEnum = pgEnum('document_type', [
  'vatican_ii',
  'encyclical',
  'apostolic_letter',
  'apostolic_exhortation',
  'motu_proprio',
  'other',
]);

// Liturgical season
export const liturgicalSeasonEnum = pgEnum('liturgical_season', [
  'advent',
  'christmas',
  'ordinary_time',
  'lent',
  'easter',
  'pentecost',
]);

// Liturgical color
export const liturgicalColorEnum = pgEnum('liturgical_color', [
  'white',
  'red',
  'green',
  'purple',
  'rose',
  'black',
]);

// Liturgical rank
export const liturgicalRankEnum = pgEnum('liturgical_rank', [
  'solemnity',
  'feast',
  'memorial',
  'optional_memorial',
  'feria',
  'sunday',
]);

// Bible testament
export const bibleTestamentEnum = pgEnum('bible_testament', [
  'old_testament',
  'new_testament',
  'deuterocanonical',
]);
