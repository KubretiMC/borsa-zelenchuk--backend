import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.get('/getAllUsers', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/updatePassword', userController.updatePassword);

export default router;
