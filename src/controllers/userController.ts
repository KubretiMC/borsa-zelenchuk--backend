import { Request, Response } from 'express';

class UserController {
  public getRegistration(req: Request, res: Response): void {
    res.json({ message: 'GET request to /api/register2222' });
  }
}

export default new UserController();
