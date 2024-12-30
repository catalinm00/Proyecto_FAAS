import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(user: any): Promise<string> {
        const payload = { username: user.username};

        return this.jwtService.sign(payload, {
            secret: user.email,
            expiresIn:'24h',
        });
    }
}