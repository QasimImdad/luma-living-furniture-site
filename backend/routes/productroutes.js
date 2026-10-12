import express from 'express';
import { getallproducts, getProductById } from '../controller/productcontroller.js';

const router = express.Router();

router.get('/', getallproducts);
router.get('/:id', getProductById);

export default router;