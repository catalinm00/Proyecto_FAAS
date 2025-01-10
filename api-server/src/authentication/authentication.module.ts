import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ApisixService } from './apisix.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret_key', // TODO: Replace with own secret key
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, ApisixService, JwtStrategy],
  exports: [AuthService],
})
export class AuthenticationModule {}
