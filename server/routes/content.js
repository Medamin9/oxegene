import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all site content
router.get('/', async (req, res, next) => {
  try {
    const content = await prisma.siteContent.findMany();
    
    const contentObj = content.reduce((acc, item) => {
      acc[item.key] = item.content;
      return acc;
    }, {});

    res.json({ content: contentObj });
  } catch (error) {
    next(error);
  }
});

// Get specific section content
router.get('/:key', async (req, res, next) => {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { key: req.params.key },
    });

    if (!content) {
      return res.status(404).json({ error: { message: 'Content not found' } });
    }

    res.json({ content: content.content });
  } catch (error) {
    next(error);
  }
});

// Get settings
router.get('/settings/all', async (req, res, next) => {
  try {
    const settings = await prisma.settings.findMany();
    
    const settingsObj = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    res.json({ settings: settingsObj });
  } catch (error) {
    next(error);
  }
});

// Get gallery images
router.get('/gallery/images', async (req, res, next) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' },
    });

    res.json({ images });
  } catch (error) {
    next(error);
  }
});

// Get testimonials
router.get('/testimonials/visible', async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    });

    res.json({ testimonials });
  } catch (error) {
    next(error);
  }
});

export default router;
