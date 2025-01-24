import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FunctionExecutionRequestedListener } from "./messaging/listener/FunctionExecutionRequestedListener";
import { DockerClient } from "./config/docker";
import { ExecuteFunctionService } from "./service/execute-function-service";
import { NatsJetStreamTransport } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "dev"}`,
    }),
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: [process.env.NATS_SERVER || "nats://localhost:4222"],
        name: "worker-result-publisher",
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            singleLine: true,
            colorize: true,
            timestamp: false,
            timestampKey: 'time',
            ignore: 'pid,hostname,context',
            messageFormat: '[{context}] {msg} {req.method} {req.url}',
            translateTime: 'dd/MM/yyyy HH:MM:ss.l',
          }
        },
      }
    })
  ],
  controllers: [FunctionExecutionRequestedListener],
  providers: [DockerClient, ExecuteFunctionService],
})
export class AppModule {}
