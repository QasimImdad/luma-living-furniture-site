import express from 'express';
import { checkout, getOrderById } from '../controller/ordercontroller.js';
import { jwtMiddleware } from '../middleware/jwtmiddleware.js';

const router = express.Router();

router.post('/', jwtMiddleware, checkout);
router.get('/:id', jwtMiddleware, getOrderById);

export default router;
