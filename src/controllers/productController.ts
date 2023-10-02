import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

class ProductController {
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const productsQuerySnapshot = await admin.firestore()
        .collection('products')
        .get();

      const productsData: any[] = [];

      productsQuerySnapshot.forEach((productDoc) => {
        const product = productDoc.data();
        const productId = productDoc.id;
        productsData.push({ productId, ...product });
      });

      res.status(200).json(productsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new ProductController();
