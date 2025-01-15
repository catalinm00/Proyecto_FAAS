import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FunctionExecutionRequestedListener } from "./messaging/listener/FunctionExecutionRequestedListener";
import * as process from "node:process";
import { DockerClient } from "./config/docker";
import { ExecuteFunctionService } from "./service/execute-function-service";
import { NatsJetStreamTransport } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

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
  ],
  controllers: [FunctionExecutionRequestedListener],
  providers: [DockerClient, ExecuteFunctionService],
})
export class AppModule {}
