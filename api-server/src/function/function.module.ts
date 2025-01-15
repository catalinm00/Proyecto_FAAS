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
import { AuthenticationModule } from '../authentication/authentication.module';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Module({
  imports: [
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: [process.env.NATS_SERVER],
        name: 'api-server-publisher',
      },
    }),
    UserModule,
    AuthenticationModule,
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
