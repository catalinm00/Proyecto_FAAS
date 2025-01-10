import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controller/user-controller/user-controller';
import { CreateUser } from './application/use-case/create-user';
import { MongoUserRepository } from './infrastructure/database/mongo-user-repository';
import { BcryptService } from './infrastructure/config/criptography/bcrypt-service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ApisixService } from 'src/authentication/apisix.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [UserController],
  providers: [MongoUserRepository, BcryptService, CreateUser, ApisixService],
  exports: [MongoUserRepository]
})
export class UserModule {}
