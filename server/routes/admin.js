import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { uploadProductImage } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(requireAdmin);

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      todayRevenue,
      pendingOrders,
      totalProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
          status: { in: ['COMPLETED'] },
        },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          status: { in: ['PENDING', 'PREPARING'] },
        },
      }),
      prisma.product.count({
        where: { available: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            take: 3,
            select: {
              productName: true,
              quantity: true,
            },
          },
        },
      }),
    ]);

    // Get best sellers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bestSellers = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      where: {
        order: {
          createdAt: { gte: thirtyDaysAgo },
          status: 'COMPLETED',
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    res.json({
      stats: {
        todayOrders,
        todayRevenue: todayRevenue._sum.total || 0,
        pendingOrders,
        totalProducts,
      },
      bestSellers,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
});

// ===== ORDERS MANAGEMENT =====

// Get all orders with filters
router.get('/orders', async (req, res, next) => {
  try {
    const {
      status,
      orderType,
      search,
      page = 1,
      limit = 20,
      startDate,
      endDate,
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (orderType) where.orderType = orderType;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            select: {
              productName: true,
              quantity: true,
              unitPrice: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/orders/:id', validate(schemas.updateOrderStatus), async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: true,
      },
    });

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// ===== IMAGE UPLOAD =====

// Upload a product image → returns { imageUrl }
router.post('/upload/product-image', uploadProductImage, (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'Aucun fichier fourni.' } });
    }
    // Build the public URL path served by express.static('/uploads')
    const imageUrl = `/uploads/products/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
});

// Helper: delete old uploaded image when it is replaced / product deleted
function deleteLocalImage(imageUrl) {
  if (!imageUrl || imageUrl.startsWith('http')) return; // skip external URLs
  try {
    const filePath = path.join(__dirname, '../../', imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (_) { /* silent */ }
}

// ===== MENU MANAGEMENT =====

// Get all categories (admin)
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// Create category
router.post('/categories', async (req, res, next) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});

// Update category
router.patch('/categories/:id', async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

// Delete category
router.delete('/categories/:id', async (req, res, next) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get all products (admin)
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ category: { order: 'asc' } }, { order: 'asc' }],
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
      include: {
        category: true,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

// Update product
router.patch('/products/:id', validate(schemas.updateProduct), async (req, res, next) => {
  try {
    // If a new local imageUrl is provided and the old one was also local, delete the old file
    if (req.body.imageUrl) {
      const existing = await prisma.product.findUnique({ where: { id: req.params.id }, select: { imageUrl: true } });
      if (existing && existing.imageUrl !== req.body.imageUrl) {
        deleteLocalImage(existing.imageUrl);
      }
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        category: true,
      },
    });

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (product) deleteLocalImage(product.imageUrl);

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ===== CONTENT MANAGEMENT =====

// Get all site content
router.get('/content', async (req, res, next) => {
  try {
    const content = await prisma.siteContent.findMany();
    res.json({ content });
  } catch (error) {
    next(error);
  }
});

// Update site content
router.patch('/content/:key', async (req, res, next) => {
  try {
    const { content } = req.body;

    const updated = await prisma.siteContent.upsert({
      where: { key: req.params.key },
      update: { content },
      create: {
        key: req.params.key,
        section: req.body.section || req.params.key,
        content,
      },
    });

    res.json({ content: updated });
  } catch (error) {
    next(error);
  }
});

// ===== GALLERY MANAGEMENT =====

// Get all gallery images
router.get('/gallery', async (req, res, next) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' },
    });

    res.json({ images });
  } catch (error) {
    next(error);
  }
});

// Create gallery image
router.post('/gallery', async (req, res, next) => {
  try {
    const image = await prisma.galleryImage.create({
      data: req.body,
    });

    res.status(201).json({ image });
  } catch (error) {
    next(error);
  }
});

// Update gallery image
router.patch('/gallery/:id', async (req, res, next) => {
  try {
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ image });
  } catch (error) {
    next(error);
  }
});

// Delete gallery image
router.delete('/gallery/:id', async (req, res, next) => {
  try {
    await prisma.galleryImage.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ===== TESTIMONIALS MANAGEMENT =====

// Get all testimonials
router.get('/testimonials', async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });

    res.json({ testimonials });
  } catch (error) {
    next(error);
  }
});

// Create testimonial
router.post('/testimonials', async (req, res, next) => {
  try {
    const testimonial = await prisma.testimonial.create({
      data: req.body,
    });

    res.status(201).json({ testimonial });
  } catch (error) {
    next(error);
  }
});

// Update testimonial
router.patch('/testimonials/:id', async (req, res, next) => {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ testimonial });
  } catch (error) {
    next(error);
  }
});

// Delete testimonial
router.delete('/testimonials/:id', async (req, res, next) => {
  try {
    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ===== MESSAGES MANAGEMENT =====

// Get all messages
router.get('/messages', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = status ? { status } : {};

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.message.count({ where }),
    ]);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update message status
router.patch('/messages/:id', async (req, res, next) => {
  try {
    const { status } = req.body;

    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ message });
  } catch (error) {
    next(error);
  }
});

// Delete message
router.delete('/messages/:id', async (req, res, next) => {
  try {
    await prisma.message.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ===== SETTINGS MANAGEMENT =====

// Get all settings
router.get('/settings', async (req, res, next) => {
  try {
    const settings = await prisma.settings.findMany();

    const settingsObj = settings.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        description: item.description,
      };
      return acc;
    }, {});

    res.json({ settings: settingsObj });
  } catch (error) {
    next(error);
  }
});

// Update setting
router.patch('/settings/:key', async (req, res, next) => {
  try {
    const { value, description } = req.body;

    const setting = await prisma.settings.upsert({
      where: { key: req.params.key },
      update: { value, description },
      create: {
        key: req.params.key,
        value,
        description,
      },
    });

    res.json({ setting });
  } catch (error) {
    next(error);
  }
});

// Change admin password
router.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: { message: 'Current password is incorrect' } });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
