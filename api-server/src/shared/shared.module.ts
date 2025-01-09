import { Global, Module } from '@nestjs/common';
import { PrismaService } from './config/db/prisma/PrismaService';
import { SwaggerModule } from '@nestjs/swagger';
import { UserModule } from '../user/user.module';
import { MongoUserRepository } from '../user/infrastructure/database/mongo-user-repository';

@Global()
@Module({
  imports: [SwaggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
