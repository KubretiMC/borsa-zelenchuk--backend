import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

class UserController {
  public async getRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, phoneNumber } = req.body;
      
      // Create a new user in Firestore
      const user = await admin.firestore().collection('users').add({
        username,
        password,
        phoneNumber,
      });
  
      res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UserController();
