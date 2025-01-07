import { Module } from '@nestjs/common';
import { FunctionController } from './infrastructure/controller/function-controller/function-controller';
import { MongoFaasFunctionRepository } from './infrastructure/database/mongo-faasfunction-repository';
import { CreateFunctionUseCase } from './application/use-case/create-function-use-case';
import { DeleteFunctionUseCase } from './application/use-case/delete-function-use-case';
import {
  FaasFunctionAssignerService,
} from './application/service/faas-function-dispatcher/faas-function-assigner.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'node:process';
import { config } from 'rxjs';
import { ExecuteFunctionUseCase } from './application/use-case/execute-function-usecase';
import { FunctionExecutionCompletedSubscriber } from './infrastructure/messaging/function-execution-completed-subscriber';

@Module({
  imports: [
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
  controllers: [FunctionController],
  providers: [MongoFaasFunctionRepository, CreateFunctionUseCase, DeleteFunctionUseCase, FaasFunctionAssignerService,
    MongoFaasFunctionRepository, FaasFunctionAssignerService, ExecuteFunctionUseCase, FunctionExecutionCompletedSubscriber],
})
export class FunctionModule {
}
