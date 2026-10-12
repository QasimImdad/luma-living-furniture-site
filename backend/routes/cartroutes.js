import express from 'express';
import {
    addTocart,
    removeCartItem,
    updateCartItem,
    viewcart,
} from '../controller/cartcontroller.js';
import { jwtMiddleware } from '../middleware/jwtmiddleware.js';

const router = express.Router();

router.post('/add', jwtMiddleware, addTocart);
router.get('/', jwtMiddleware, viewcart);
router.post('/', jwtMiddleware, viewcart);
router.patch('/items/:itemId', jwtMiddleware, updateCartItem);
router.delete('/items/:itemId', jwtMiddleware, removeCartItem);

export default router;