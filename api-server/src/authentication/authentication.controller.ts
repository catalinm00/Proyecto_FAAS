import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('verify-token')
  verifyToken(@Body('token') token: string) {
    try {
      const payload = this.jwtService.verifyToken(token);
      return { valid: true, payload };
    } catch (error) {
      throw new BadRequestException(error + ' Invalid token');
    }
  }

  @Post('decode-token')
  decodeToken(@Body('token') token: string) {
    const payload = this.jwtService.decodeToken(token);
    return { payload };
  }
}
