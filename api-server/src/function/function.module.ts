import { Module } from '@nestjs/common';
import { FunctionController } from './infrastructure/controller/function-controller/function-controller';
import { MongoFaasFunctionRepository } from './infrastructure/database/mongo-faasfunction-repository';
import { CreateFunctionUseCase } from './application/use-case/create-function-use-case';
import { DeleteFunctionUseCase } from './application/use-case/delete-function-use-case';
import { FaasFunctionAssignerService } from './application/service/faas-function-dispatcher/faas-function-assigner.service';
import { ExecuteFunctionUseCase } from './application/use-case/execute-function-usecase';
import { FunctionExecutionCompletedSubscriber } from './infrastructure/messaging/function-execution-completed-subscriber';
import { MongoFaasFunctionExecutionRepository } from './infrastructure/database/mongo-faasfunction-execution-repository';
import { FunctionExecutionRequestedPublisher } from './infrastructure/messaging/function-execution-requested-publisher';
import { UserModule } from '../user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import process from 'node:process';

@Module({
  imports: [
    UserModule,
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process?.env?.NATS_SERVER || 'nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [FunctionController],
  providers: [
    MongoFaasFunctionRepository,
    CreateFunctionUseCase,
    DeleteFunctionUseCase,
    MongoFaasFunctionExecutionRepository,
    FaasFunctionAssignerService,
    ExecuteFunctionUseCase,
    FunctionExecutionCompletedSubscriber,
    FunctionExecutionRequestedPublisher,
    MongoFaasFunctionExecutionRepository,
  ],
})
export class FunctionModule {}
