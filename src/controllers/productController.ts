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

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { userId, product } = req.body;
      const {
        name = '',
        cost = 0,
        availability = 0,
        minOrder = 0,
        place = '',
        image = '',
        additionalInformation = '',
      } = product;

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}.${currentDate.toLocaleString('default', { month: 'short' })}`;

      const newProductRef = await admin.firestore().collection('products').add({
        name,
        cost: parseFloat(cost),
        availability: parseFloat(availability),
        minOrder: parseFloat(minOrder),
        place,
        image: image || '',
        additionalInformation,
        reserved: false,
        finished: false,
        dateAdded: formattedDate,
      });

      const productId = newProductRef.id;

      // Update the user's offers array
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const updatedOffers = userData?.offers ? [...userData.offers, productId] : [productId];
        await userRef.update({ offers: updatedOffers });
      }
      res.status(201).json({ productId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new ProductController();
