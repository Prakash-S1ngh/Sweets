import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth';

// Place order: move cart --> orders, clear cart
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const cart: any = await Cart.findOne({ user: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = (cart.items || []).map((it: any) => ({
      sweetId: it.sweetId,
      quantity: it.quantity,
      price: it.price,
    }));

    const totalAmount = items.reduce((s: number, it: any) => s + (it.price * it.quantity), 0);

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      orderStatus: 'pending',
      paymentMethod: req.body.paymentMethod || 'cod',
      paymentStatus: req.body.paymentStatus || 'pending'
    });

    // clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({ success: true, order });
  } catch (err: any) {
    console.error('Place order error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get orders for user, optional date range filter (startDate, endDate in ISO)
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query as any;

    const filter: any = { user: userId };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        // include entire day for endDate if date-only provided
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = ed;
      }
    }

    const orders = await Order.find(filter).populate('items.sweetId').sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (err: any) {
    console.error('Get orders error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: fetch all orders (optionally by date)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as any;
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = ed;
      }
    }

    const orders = await Order.find(filter).populate('items.sweetId').sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err: any) {
    console.error('Get all orders error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
