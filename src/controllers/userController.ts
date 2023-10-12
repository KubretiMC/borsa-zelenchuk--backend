import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
        res.status(400).json({ error: 'USERNAME_TAKEN' });
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

      const secretKey = process.env.JWT_SECRET_KEY as string;
      const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

      res.status(201).json({
        id: userId,
        username: userData?.username,
        phoneNumber: userData?.phoneNumber,
        token
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
        res.status(400).json({ error: 'USERNAME_PASSWORD_WRONG' });
        return;
      }

      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();

      const hashedPassword = userData.password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (!passwordMatch) {
        res.status(400).json({ error: 'USERNAME_PASSWORD_WRONG' });
        return;
      }

      const secretKey = process.env.JWT_SECRET_KEY as string;
      const token = jwt.sign({ userId: userDoc.id }, secretKey, { expiresIn: '5m' });
  
      res.status(200).json({
        id: userDoc.id,
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        offers: userData.offers,
        token
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
        res.status(404).json({ error: 'USER_NOT_FOUND' });
        return;
      }

      const userData = userDoc.data();

      const hashedPassword = userData?.password;
      const passwordMatch = await bcrypt.compare(currentPassword, hashedPassword);

      if (!passwordMatch) {
        res.status(400).json({ error: 'PASSWORD_INVALID' });
        return;
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await userRef.update({ password: newHashedPassword });

      res.status(200).json({ message: 'PASSWORD_CHANGED' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UserController();
