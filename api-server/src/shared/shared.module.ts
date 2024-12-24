import { Global, Module } from '@nestjs/common';
import { PrismaService } from './config/db/prisma/PrismaService';
import { SwaggerModule } from '@nestjs/swagger';

@Global()
@Module({
  imports: [SwaggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {
}
