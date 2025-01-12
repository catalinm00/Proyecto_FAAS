import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ApisixService } from './apisix.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // TODO: Replace with own secret key
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, ApisixService, JwtStrategy, JwtService],
  controllers: [AuthenticationController],
  exports: [AuthService, JwtService],
})
export class AuthenticationModule {}
