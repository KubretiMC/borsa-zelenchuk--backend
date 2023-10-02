import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

class UserController {
  public async getRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, phoneNumber } = req.body;

      const userQuerySnapshot = await admin.firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

      if (!userQuerySnapshot.empty) {
        res.status(400).json({ error: 'Username already exists' });
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
}

export default new UserController();
