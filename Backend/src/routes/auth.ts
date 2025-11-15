import { Router } from 'express';
import { registerController, loginController, fetchuserController, logoutController, addToCart, getCart, updateCartItem } from '../controllers/auth';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/users',authenticate,fetchuserController);
router.post('/logout',logoutController);
router.post('/addcart',authenticate,addToCart);
router.put('/updatecart',authenticate,updateCartItem);
router.get('/getcart',authenticate,getCart);

export default router;
