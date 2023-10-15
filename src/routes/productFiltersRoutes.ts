import express from 'express';
import { verifyToken } from '../utils/utils';
import productFiltersController from '../controllers/productFiltersController';

const router = express.Router();

router.get('/getProductFilters', verifyToken, productFiltersController.getProductFilters);

export default router;
