import express from 'express';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', productController.addProduct);

export default router;
