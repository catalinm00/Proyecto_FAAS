import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET;

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new UnauthorizedException(error + ' Invalid token');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
