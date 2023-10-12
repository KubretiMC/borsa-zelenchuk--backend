import express from 'express';
import productController from '../controllers/productController';
import { verifyToken } from '../utils/utils';

const router = express.Router();

router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', verifyToken, productController.addProduct);
router.post('/reserveProduct', productController.reserveProduct);
router.post('/finishProduct', productController.finishProduct);

export default router;
