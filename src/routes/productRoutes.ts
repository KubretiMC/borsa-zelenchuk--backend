import express from 'express';
import productController from '../controllers/productController';

const router = express.Router();

router.post('/getAll', productController.getAllProducts);

export default router;
