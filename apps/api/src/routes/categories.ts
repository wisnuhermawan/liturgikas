import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, desc, isNull } from 'drizzle-orm';
import db from '@catholic-platform/database';
import * as schema from '@catholic-platform/database/schema';
import { authMiddleware, type AuthEnv } from '../middleware/auth';

const categories = new Hono<AuthEnv>();

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  parentId: z.number().int().positive().optional(),
  displayOrder: z.number().int().default(0),
});

const categoryUpdateSchema = categorySchema.partial();

// GET /api/categories - List all categories
categories.get('/', async (c) => {
  try {
    const { parent } = c.req.query();

    let categoriesList;

    if (parent === 'null' || parent === 'root') {
      // Get root categories (no parent)
      categoriesList = await db.query.categories.findMany({
        where: isNull(schema.categories.parentId),
        orderBy: (categories, { asc }) => [asc(categories.displayOrder), asc(categories.name)],
      });
    } else {
      // Get all categories
      categoriesList = await db.query.categories.findMany({
        orderBy: (categories, { asc }) => [asc(categories.displayOrder), asc(categories.name)],
      });
    }

    return c.json({
      success: true,
      data: categoriesList,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      500
    );
  }
});

// GET /api/categories/:id - Get single category
categories.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const category = await db.query.categories.findFirst({
      where: eq(schema.categories.id, parseInt(id)),
      with: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      return c.json(
        {
          success: false,
          error: 'Category not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch category',
      },
      500
    );
  }
});

// POST /api/categories - Create new category
categories.post('/', authMiddleware, zValidator('json', categorySchema), async (c) => {
  try {
    const data = c.req.valid('json');

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const [newCategory] = await db
      .insert(schema.categories)
      .values({
        ...data,
        slug,
      })
      .returning();

    return c.json(
      {
        success: true,
        data: newCategory,
        message: 'Category created successfully',
      },
      201
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.code === '23505') {
      return c.json(
        {
          success: false,
          error: 'A category with similar name already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to create category',
      },
      500
    );
  }
});

// PUT /api/categories/:id - Update category
categories.put('/:id', authMiddleware, zValidator('json', categoryUpdateSchema), async (c) => {
  try {
    const { id } = c.req.param();
    const data = c.req.valid('json');

    // Check if category exists
    const existingCategory = await db.query.categories.findFirst({
      where: eq(schema.categories.id, parseInt(id)),
    });

    if (!existingCategory) {
      return c.json(
        {
          success: false,
          error: 'Category not found',
        },
        404
      );
    }

    // Update slug if name changed
    let slug = existingCategory.slug;
    if (data.name && data.name !== existingCategory.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const [updatedCategory] = await db
      .update(schema.categories)
      .set({
        ...data,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(schema.categories.id, parseInt(id)))
      .returning();

    return c.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating category:', error);

    if (error.code === '23505') {
      return c.json(
        {
          success: false,
          error: 'A category with similar name already exists',
        },
        409
      );
    }

    return c.json(
      {
        success: false,
        error: 'Failed to update category',
      },
      500
    );
  }
});

// DELETE /api/categories/:id - Delete category
categories.delete('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();

    // Check if category exists
    const existingCategory = await db.query.categories.findFirst({
      where: eq(schema.categories.id, parseInt(id)),
    });

    if (!existingCategory) {
      return c.json(
        {
          success: false,
          error: 'Category not found',
        },
        404
      );
    }

    // Check if category has children
    const children = await db.query.categories.findMany({
      where: eq(schema.categories.parentId, parseInt(id)),
    });

    if (children.length > 0) {
      return c.json(
        {
          success: false,
          error: 'Cannot delete category with subcategories',
        },
        400
      );
    }

    await db.delete(schema.categories).where(eq(schema.categories.id, parseInt(id)));

    return c.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to delete category',
      },
      500
    );
  }
});

export default categories;
