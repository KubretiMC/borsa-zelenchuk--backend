import express from 'express';
import productController from '../controllers/productController';
import { verifyToken } from '../utils/utils';

const router = express.Router();

router.get('/getAllProducts', verifyToken, productController.getAllProducts);
router.post('/addProduct', verifyToken, productController.addProduct);
router.post('/reserveProduct', verifyToken, productController.reserveProduct);
router.post('/finishProduct', verifyToken, productController.finishProduct);

export default router;
