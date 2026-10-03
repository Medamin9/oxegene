import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories with products
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            available: true,
          },
        },
      },
      include: {
        products: {
          where: { available: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Get single category with products
router.get('/categories/:slug', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { available: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

export default router;
