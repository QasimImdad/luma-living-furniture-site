import express from 'express';
import { editUser, loginfunc, registerfunc } from '../controller/authcontroller.js';
import { authRateLimit, jwtMiddleware } from '../middleware/jwtmiddleware.js';

const router = express.Router()

router.post('/register', authRateLimit, registerfunc);
router.post('/login', authRateLimit, loginfunc);
router.put('/edit/:id', jwtMiddleware, editUser);

export default router;