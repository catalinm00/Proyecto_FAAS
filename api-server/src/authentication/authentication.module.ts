import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ApisixService } from './apisix.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret_key', // TODO: Replace with own secret key
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, ApisixService, JwtStrategy, JwtService],
  controllers: [AuthenticationController],
  exports: [AuthService, JwtService],
})
export class AuthenticationModule {}
