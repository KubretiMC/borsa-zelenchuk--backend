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
        productsData.push({ id: productId, ...product });
      });

      res.status(200).json(productsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId as string;
      const { product } = req.body;
      
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
      res.status(201).json({ message: 'OFFER_ADDED_SUCCESSFULLY' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async reserveProduct(req: Request, res: Response): Promise<void> {
    try {
      const { userId, productId, orderQuantity, minimumOrder, reservedCost } = req.body;
  
      // Fetch the product to check availability
      const productRef = admin.firestore().collection('products').doc(productId);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        res.status(404).json({ error: 'PRODUCT_NOT_AVAILABLE' });
        return;
      }
  
      const productData = productDoc.data();
  
      if (!productData || productData.reserved) {
        res.status(400).json({ error: 'PRODUCT_NOT_AVAILABLE' });
        return;
      }
  
      const currentAvailability = productData.availability;
  
      // Update the product's availability and mark it as reserved
      const updatedAvailability = currentAvailability - orderQuantity;
      await productRef.update({
        availability: 0,
        reserved: true,
        reservedCost: parseFloat(reservedCost),
      });
  
      // Update the user's reserved products
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        res.status(404).json({ error: 'USER_NOT_FOUND' });
        return;
      }
  
      const userData = userDoc.data();
      const updatedReservedProducts = userData?.userReserved ? [...userData.userReserved, productId] : [productId];
  
      await userRef.update({ userReserved: updatedReservedProducts });

      // if the new availability is more than the minimum order, we create a new product that can be reserved by the users
      if (updatedAvailability > minimumOrder) {
        const newProductId = admin.firestore().collection('products').doc().id;

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}.${currentDate.toLocaleString('default', { month: 'short' })}`;

        const newProductData = {
          ...productData,
          id: newProductId,
          reserved: false,
          availability: updatedAvailability,
          dateAdded: formattedDate,
        };
        await admin.firestore().collection('products').doc(newProductId).set(newProductData);

        // Find the user who has the original productId in their offers
        const usersCollection = admin.firestore().collection('users');
        const query = usersCollection.where('offers', 'array-contains', productId);
        const querySnapshot = await query.get();

        if (!querySnapshot.empty) {
          const userWithOriginalProduct = querySnapshot.docs[0].data();

          // Update the user and add the new product to their offers
          const updatedUserOffers = [...userWithOriginalProduct.offers, newProductId];
          await admin.firestore().collection('users').doc(querySnapshot.docs[0].id).update({ offers: updatedUserOffers });
        }  
        res.status(200).json({ message: 'PRODUCT_RESERVED_SUCCESSFULLY' });
      } else {
        res.status(200).json({ message: 'PRODUCT_RESERVED_SUCCESSFULLY' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async finishProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId: productIdFinishProduct } = req.body;
      const productRef = admin.firestore().collection('products').doc(productIdFinishProduct);
      const productDoc = await productRef.get();
  
      if (!productDoc.exists) {
        res.status(404).json({ error: 'PRODUCT_NOT_AVAILABLE' });
        return;
      }
  
      await productRef.update({
        finished: true,
      });
  
      res.status(200).json({ message: 'PRODUCT_FINISHED_SUCCESSFULLY' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new ProductController();
