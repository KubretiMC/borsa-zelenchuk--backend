import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { ProductFilter } from '../interfaces/interfaces';

class ProductFiltersController {
  public async getProductFilters(req: Request, res: Response): Promise<void> {
    try {
      const productFiltersQuerySnapshot = await admin.firestore()
        .collection('productFilters')
        .get();
  
      const productFiltersData: ProductFilter[] = productFiltersQuerySnapshot.docs.map(productDoc => productDoc.data() as ProductFilter);
  
      if (productFiltersData.length > 0) {
        res.status(200).json(productFiltersData[0]);
      } else {
        res.status(200).json(null);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
}

export default new ProductFiltersController();
