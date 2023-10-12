import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req?.headers?.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send({ auth: false, error: 'ERROR_OCCURED' });
  }

  const secretKey = process.env.JWT_SECRET_KEY as string;
  jwt.verify(token, secretKey, (err, decoded: any) => {
    if (err) {
      return res.status(500).send({ auth: false, error: 'ERROR_OCCURED' });
    }
    req.userId = decoded.userId;
    next();
  });
}
