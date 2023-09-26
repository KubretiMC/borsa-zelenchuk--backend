import express from 'express';
import registerController from '../controllers/userController';

const router = express.Router();

router.post('/', registerController.getRegistration);

export default router;
