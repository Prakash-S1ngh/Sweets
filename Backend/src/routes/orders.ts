import { Router } from 'express';
import { placeOrder, getOrders, getAllOrders } from '../controllers/orders';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/orders/place -> place an order for authenticated user
router.post('/place', authenticate, placeOrder);

// GET /api/orders -> get orders for authenticated user, optionally filter by startDate/endDate
router.get('/', authenticate, getOrders);

// Admin: get all orders (date filters supported)
router.get('/all', authenticate, authorize('admin'), getAllOrders);

export default router;
