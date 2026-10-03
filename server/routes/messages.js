import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create message (contact form)
router.post('/', validate(schemas.createMessage), async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'UNREAD',
      },
    });

    res.status(201).json({ message: newMessage });
  } catch (error) {
    next(error);
  }
});

export default router;
