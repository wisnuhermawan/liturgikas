import { z } from 'zod';

// Common response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types
export const userRoles = ['admin', 'content_manager', 'viewer'] as const;
export type UserRole = (typeof userRoles)[number];

export const userStatuses = ['active', 'suspended', 'inactive'] as const;
export type UserStatus = (typeof userStatuses)[number];

// Content types
export const contentTypes = ['article', 'document', 'prayer', 'homily', 'qa', 'page'] as const;
export type ContentType = (typeof contentTypes)[number];

export const contentStatuses = ['draft', 'published', 'archived'] as const;
export type ContentStatus = (typeof contentStatuses)[number];

// Liturgical types
export const liturgicalSeasons = [
  'advent',
  'christmas',
  'ordinary_time',
  'lent',
  'easter',
  'pentecost',
] as const;
export type LiturgicalSeason = (typeof liturgicalSeasons)[number];

export const liturgicalColors = ['white', 'red', 'green', 'purple', 'rose', 'black'] as const;
export type LiturgicalColor = (typeof liturgicalColors)[number];

// Bible types
export const bibleTestaments = ['old_testament', 'new_testament', 'deuterocanonical'] as const;
export type BibleTestament = (typeof bibleTestaments)[number];

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
});

export const contentSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  excerpt: z.string().optional(),
  body: z.string().min(1),
  contentType: z.enum(contentTypes),
  status: z.enum(contentStatuses),
  categoryId: z.number().optional(),
  featuredImageUrl: z.string().url().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContentInput = z.infer<typeof contentSchema>;
