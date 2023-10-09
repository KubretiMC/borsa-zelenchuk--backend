import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';

class UserController {
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const userQuerySnapshot = await admin.firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (!userQuerySnapshot.empty) {
        res.status(400).json({ error: 'Потребителското име вече съществува!' });
        return;
      }

      const userRef = await admin.firestore().collection('users').add({
        username,
        password: hashedPassword,
        phoneNumber,
      });

      const userDoc = await userRef.get();
      const userId = userDoc.id;
      const userData = userDoc.data();

      res.status(201).json({
        id: userId,
        username: userData?.username,
        phoneNumber: userData?.phoneNumber,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const userQuerySnapshot = await admin.firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (userQuerySnapshot.empty) {
        res.status(400).json({ error: 'Грешно потребителско име или парола!' });
        return;
      }

      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();

      const hashedPassword = userData.password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (!passwordMatch) {
        res.status(400).json({ error: 'Грешно потребителско име или парола!' });
        return;
      }
  
      res.status(200).json({
        id: userDoc.id,
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        offers: userData.offers
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const usersQuerySnapshot = await admin.firestore()
        .collection('users')
        .get();

      const usersData: any[] = [];
  
      usersQuerySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const { password, ...otherData } = userData;
        const userId = userDoc.id;
        usersData.push({ id: userId, ...otherData });
      });
  
      res.status(200).json(usersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }  

  public async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      const userRef = admin.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'Потребителят не е намерен' });
        return;
      }

      const userData = userDoc.data();
      if (userData?.password !== currentPassword) {
        res.status(400).json({ error: 'Невалидна текуща парола!' });
        return;
      }
      await userRef.update({ password: newPassword });

      res.status(200).json({ message: 'Паролата е сменена успешно!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UserController();
