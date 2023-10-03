import express from 'express';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', productController.addProduct);
router.post('/reserveProduct', productController.reserveProduct);

export default router;
