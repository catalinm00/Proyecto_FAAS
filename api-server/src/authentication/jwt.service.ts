import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = 'your_jwt_secret_key'; // TODO: Replace with own secret key

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error(error + ' Invalid token');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
