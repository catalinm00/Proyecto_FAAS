import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomStrategy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { NatsJetStreamServer } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const configService: ConfigService = app.get(ConfigService);
  const opts: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: [process.env.NATS_SERVER || "nats://localhost:4222"],
        name: "worker-function-listener",
      },
      consumerOptions: {
        durable: "worker-durable",
        deliverTo: "worker-messages",
        deliverGroup: "worker-group",
        manualAck: false,
      },
      streamConfig: {
        name: "functions-stream",
        subjects: [configService.get("NATS_QUEUE", "functions")],
      },
    }),
  };
  app.connectMicroservice(opts);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
