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
      res.status(201).json({ id: productId });
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
        res.status(404).json({ error: 'Продуктът не е намерен!' });
        return;
      }
  
      const productData = productDoc.data();
  
      if (!productData || productData.reserved) {
        res.status(400).json({ error: 'Продуктът не е достъпен за резервация!' });
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
  
      // Fetch the updated product data
      const updatedProductSnapshot = await productRef.get();
      const updatedProductData = updatedProductSnapshot.data();
  
      // Update the user's reserved products
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        res.status(404).json({ error: 'Потребителят не е намерен!' });
        return;
      }
  
      const userData = userDoc.data();
      const updatedReservedProducts = userData?.reservedProducts ? [...userData.reservedProducts, productId] : [productId];
  
      await userRef.update({ reservedProducts: updatedReservedProducts });
  
      // Fetch the updated user data
      const updatedUserSnapshot = await userRef.get();
      const updatedUserData = updatedUserSnapshot.data();
  
      console.log('updatedProductData', updatedProductData);
      console.log('updatedUserData', updatedUserData);
  

      console.log('updatedAvailability', updatedAvailability);
      console.log('minimumOrder', minimumOrder);
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
        console.log('newProductData', newProductData);
        res.status(200).json({
          message: 'Продуктът е резервиран успешно и създаден нов продукт!',
          updatedProduct: updatedProductData,
          updatedUser: updatedUserData,
          newProduct: newProductData,
        });
      } else {
        res.status(200).json({
          message: 'Продуктът е резервиран успешно!',
          updatedProduct: updatedProductData,
          updatedUser: updatedUserData,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
}

export default new ProductController();
