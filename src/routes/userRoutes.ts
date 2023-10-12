import express from 'express';
import userController from '../controllers/userController';
import { verifyToken } from '../utils/utils';

const router = express.Router();

router.get('/getAllUsers', verifyToken, userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/updatePassword', verifyToken, userController.updatePassword);

export default router;
