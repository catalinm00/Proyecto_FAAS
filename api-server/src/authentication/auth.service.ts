import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: any): Promise<string> {
    const payload = { key: user.key };

    return this.jwtService.sign(payload, {
      secret: user.secret,
      expiresIn: '24h',
    });
  }
}
