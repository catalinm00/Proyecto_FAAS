import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controller/user-controller/user-controller';
import { CreateUser } from './application/use-case/create-user';
import { MongoUserRepository } from './infrastructure/database/mongo-user-repository';
import { BcryptService } from './infrastructure/config/criptography/bcrypt-service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ApisixService } from 'src/authentication/apisix.service';
import { DeleteUser } from './application/use-case/delete-user';
import { CheckUser } from './application/use-case/check-user';
import { LoginController } from './infrastructure/controller/check-user-controller/login-controller';
import { GetUserByIdUseCase } from './application/use-case/get-user-by-id-use-case';

@Module({
  imports: [AuthenticationModule],
  controllers: [UserController, LoginController],
  providers: [
    MongoUserRepository,
    BcryptService,
    CreateUser,
    ApisixService,
    CheckUser,
    GetUserByIdUseCase,
    DeleteUser],
  exports: [MongoUserRepository],
})
export class UserModule {}
