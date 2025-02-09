import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FunctionExecutionRequestedListener } from "./messaging/listener/FunctionExecutionRequestedListener";
import { DockerClient } from "./config/docker";
import { ExecuteFunctionService } from "./service/execute-function-service";
import { SqsModule } from "@ssut/nestjs-sqs";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "dev"}`,
    }),
    SqsModule.registerAsync({
      useFactory: () => {
        return {
          consumers: [
            {
              name: process.env.FUNCTION_DISPATCHING_QUEUE,
              queueUrl: process.env.FUNCTION_DISPATCHING_QUEUE_URL,
              region: process.env.AWS_REGION,
              useQueueUrlAsEndpoint: true,
            },
          ],
        };
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
            timestampKey: "time",
            ignore: "pid,hostname,context",
            messageFormat: "[{context}] {msg} {req.method} {req.url}",
            translateTime: "dd/MM/yyyy HH:MM:ss.l",
          },
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    DockerClient,
    ExecuteFunctionService,
    FunctionExecutionRequestedListener,
  ],
})
export class AppModule {}
