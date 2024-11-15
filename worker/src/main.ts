import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug'] });
  const configService: ConfigService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      service: [configService.get('NATS_SERVER', 'nats://localhost:4222')],
      queue: configService.get('NATS_QUEUE', 'activate-function'),
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
