import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controller/user-controller/user-controller';
import { CreateUser } from './application/use-case/create-user';
import { MongoUserRepository } from './infrastructure/database/mongo-user-repository';
import { BcryptService } from './infrastructure/config/criptography/bcrypt-service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [MongoUserRepository, BcryptService, CreateUser],
})
export class UserModule {}
