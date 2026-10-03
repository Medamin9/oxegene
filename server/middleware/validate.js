import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          message: 'Validation error',
          details: error.errors,
        },
      });
    }
    next(error);
  }
};

// Common validation schemas
export const schemas = {
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),

  createOrder: z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(8),
    customerEmail: z.string().email().optional(),
    orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
    tableNumber: z.string().optional(),
    deliveryAddress: z.string().optional(),
    specialNotes: z.string().optional(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1),
      size: z.string().optional(),
      customizations: z.string().optional(),
      specialNotes: z.string().optional(),
    })).min(1),
  }),

  createMessage: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10),
  }),

  updateProduct: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    available: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isSpecialty: z.boolean().optional(),
    order: z.number().int().optional(),
  }),

  updateOrderStatus: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
  }),
};
