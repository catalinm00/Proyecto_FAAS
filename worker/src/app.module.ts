import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ActivateFunctionListener } from './messaging/listener/ActivateFunctionListener';
import { NatsService } from './service/NatsService';
import * as process from 'node:process';
import { DockerClient } from './config/docker';
import { ExecuteFunctionServiceAlt } from './service/execute-function-service-alt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    ClientsModule.register([{
      name: 'NATS_CLIENT',
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_SERVER || 'nats://localhost:4222'],
      },
    }]),
  ],
  controllers: [ ActivateFunctionListener, AppController],
  providers: [NatsService, DockerClient, ExecuteFunctionServiceAlt],
})
export class AppModule {
}
