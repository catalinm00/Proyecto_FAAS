import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FunctionExecutionRequestedListener } from './messaging/listener/FunctionExecutionRequestedListener';
import { NatsService } from './service/NatsService';
import * as process from 'node:process';
import { DockerClient } from './config/docker';
import { ExecuteFunctionService } from './service/execute-function-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER || 'nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [FunctionExecutionRequestedListener, AppController],
  providers: [NatsService, DockerClient, ExecuteFunctionService],
})
export class AppModule {}
