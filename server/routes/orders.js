import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();
const prisma = new PrismaClient();

// Generate order number
function generateOrderNumber() {
  const prefix = 'OXG';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

// Create order
router.post('/', validate(schemas.createOrder), async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      tableNumber,
      deliveryAddress,
      specialNotes,
      items,
    } = req.body;

    // Fetch product details and calculate totals
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = products.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.productId];
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (!product.available) {
        throw new Error(`Product ${product.name} is not available`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        size: item.size,
        customizations: item.customizations,
        specialNotes: item.specialNotes,
      };
    });

    const total = subtotal; // Add taxes or fees here if needed

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        tableNumber,
        deliveryAddress,
        specialNotes,
        subtotal,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

// Get order status
router.get('/:orderNumber/status', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      select: {
        orderNumber: true,
        status: true,
        createdAt: true,
        orderType: true,
        tableNumber: true,
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

// Get order details
router.get('/:orderNumber', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
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

export default router;
