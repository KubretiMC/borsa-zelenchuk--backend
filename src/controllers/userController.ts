import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

class UserController {
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, phoneNumber } = req.body;

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
        password,
        phoneNumber,
      });

      const userDoc = await userRef.get();
      const userId = userDoc.id;
      const userData = userDoc.data();

      res.status(201).json({
        userId,
        username: userData?.username,
        password: userData?.password,
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
        .where('password', '==', password)
        .get();

      if (userQuerySnapshot.empty) {
        res.status(400).json({ error: 'Грешно потребителско име или парола!' });
        return;
      }

      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();

      res.status(200).json({
        userId: userDoc.id,
        username: userData.username,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
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
        const userId = userDoc.id;
        usersData.push({ userId, ...userData });
      });
  
      res.status(200).json(usersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }  
}

export default new UserController();
