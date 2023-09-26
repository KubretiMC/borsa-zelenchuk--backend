import express from 'express';
import registerController from '../controllers/userController';

const router = express.Router();

router.get('/', registerController.getRegistration);

export default router;
