import express from 'express';
import registerController from '../controllers/registerController';

const router = express.Router();

router.get('/', registerController.getRegistration);

export default router;
