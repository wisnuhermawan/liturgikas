import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, desc, and, ilike, or, sql } from 'drizzle-orm';
import db from '@catholic-platform/database';
import * as schema from '@catholic-platform/database/schema';
import { authMiddleware, type AuthEnv } from '../middleware/auth';

const contents = new Hono<AuthEnv>();

// Validation schemas
const contentSchema = z.object({
  title: z.string().min(1).max(500),
  excerpt: z.string().optional(),
  body: z.string().min(1),
  contentType: z.enum(['article', 'document', 'prayer', 'homily', 'qa', 'page']),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  categoryId: z.number().int().positive().optional(),
  featuredImageUrl: z.string().url().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

const contentUpdateSchema = contentSchema.partial();

// GET /api/contents - List all contents with filters
contents.get('/', authMiddleware, async (c) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      contentType,
      categoryId,
      search,
    } = c.req.query();

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const conditions = [];
    if (status) {
      conditions.push(eq(schema.contents.status, status as any));
    }
    if (contentType) {
      conditions.push(eq(schema.contents.contentType, contentType as any));
    }
    if (categoryId) {
      conditions.push(eq(schema.contents.categoryId, parseInt(categoryId)));
    }
    if (search) {
      conditions.push(
        or(
          ilike(schema.contents.title, `%${search}%`),
          ilike(schema.contents.excerpt, `%${search}%`),
          ilike(schema.contents.body, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [contentsList, totalResult] = await Promise.all([
      db.query.contents.findMany({
        where: whereClause,
        with: {
          category: true,
          createdByUser: {
            columns: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
        limit: limitNum,
        offset: offset,
        orderBy: (contents, { desc }) => [desc(contents.createdAt)],
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schema.contents)
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limitNum);

    return c.json({
      success: true,
      data: {
        contents: contentsList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch contents',
      },
      500
    );
  }
});

// GET /api/contents/:id - Get single content by ID
contents.get('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();

    const content = await db.query.contents.findFirst({
      where: eq(schema.contents.id, id),
      with: {
        category: true,
        createdByUser: {
          columns: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
        updatedByUser: {
          columns: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    if (!content) {
      return c.json(
        {
          success: false,
          error: 'Content not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch content',
      },
      500
    );
  }
});

// POST /api/contents - Create new content
contents.post('/', authMiddleware, zValidator('json', contentSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const user = c.get('user');

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const [newContent] = await db
      .insert(schema.contents)
      .values({
        ...data,
        slug,
        createdBy: user.userId,
        updatedBy: user.userId,
      })
      .returning();

    return c.json(
      {
        success: true,
        data: newContent,
        message: 'Content created successfully',
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating content:', error);

    // Handle unique constraint violation (duplicate slug)
    if (error.code === '23505') {
      return c.json(
        {
          success: false,
          error: 'A content with similar title already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to create content',
      },
      500
    );
  }
});

// PUT /api/contents/:id - Update content
contents.put('/:id', authMiddleware, zValidator('json', contentUpdateSchema), async (c) => {
  try {
    const { id } = c.req.param();
    const data = c.req.valid('json');
    const user = c.get('user');

    // Check if content exists
    const existingContent = await db.query.contents.findFirst({
      where: eq(schema.contents.id, id),
    });

    if (!existingContent) {
      return c.json(
        {
          success: false,
          error: 'Content not found',
        },
        404
      );
    }

    // Update slug if title changed
    let slug = existingContent.slug;
    if (data.title && data.title !== existingContent.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const [updatedContent] = await db
      .update(schema.contents)
      .set({
        ...data,
        slug,
        updatedBy: user.userId,
        updatedAt: new Date(),
      })
      .where(eq(schema.contents.id, id))
      .returning();

    return c.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating content:', error);

    if (error.code === '23505') {
      return c.json(
        {
          success: false,
          error: 'A content with similar title already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to update content',
      },
      500
    );
  }
});

// DELETE /api/contents/:id - Delete content
contents.delete('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const user = c.get('user');

    // Check if content exists
    const existingContent = await db.query.contents.findFirst({
      where: eq(schema.contents.id, id),
    });

    if (!existingContent) {
      return c.json(
        {
          success: false,
          error: 'Content not found',
        },
        404
      );
    }

    // Only admin can delete or content creator
    if (user.role !== 'admin' && existingContent.createdBy !== user.userId) {
      return c.json(
        {
          success: false,
          error: 'You do not have permission to delete this content',
        },
        403
      );
    }

    await db.delete(schema.contents).where(eq(schema.contents.id, id));

    return c.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to delete content',
      },
      500
    );
  }
});

// PATCH /api/contents/:id/publish - Publish content
contents.patch('/:id/publish', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const user = c.get('user');

    const [updatedContent] = await db
      .update(schema.contents)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedBy: user.userId,
        updatedAt: new Date(),
      })
      .where(eq(schema.contents.id, id))
      .returning();

    if (!updatedContent) {
      return c.json(
        {
          success: false,
          error: 'Content not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: updatedContent,
      message: 'Content published successfully',
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to publish content',
      },
      500
    );
  }
});

// PATCH /api/contents/:id/unpublish - Unpublish content
contents.patch('/:id/unpublish', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const user = c.get('user');

    const [updatedContent] = await db
      .update(schema.contents)
      .set({
        status: 'draft',
        updatedBy: user.userId,
        updatedAt: new Date(),
      })
      .where(eq(schema.contents.id, id))
      .returning();

    if (!updatedContent) {
      return c.json(
        {
          success: false,
          error: 'Content not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: updatedContent,
      message: 'Content unpublished successfully',
    });
  } catch (error) {
    console.error('Error unpublishing content:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to unpublish content',
      },
      500
    );
  }
});

export default contents;
