import { Global, Module } from '@nestjs/common';
import { PrismaService } from './config/db/prisma/PrismaService';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {
}
