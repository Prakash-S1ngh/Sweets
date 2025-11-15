import { Router } from 'express';
import * as controller from '../controllers/sweets';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/',authenticate, controller.listSweets);
// router.get('/customer', controller.fetchsweetsforcustomer);
router.get('/search', controller.searchSweets);
router.post('/', authenticate, authorize('admin'), controller.createSweet);
router.put('/:id', authenticate, authorize('admin'), controller.updateSweet);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteSweet);
router.post('/:id/purchase', authenticate, controller.purchaseSweet);
router.post('/:id/restock', authenticate, authorize('admin'), controller.restockSweet);

export default router;
