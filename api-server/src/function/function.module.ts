import { Module } from '@nestjs/common';
import { FunctionController } from './infrastructure/controller/function-controller';
import { MongoFaasFunctionRepository } from './infrastructure/database/mongo-faasfunction-repository';
import { CreateFunctionUseCase } from './application/use-case/create-function-use-case';
import { DeleteFunctionUseCase } from './application/use-case/delete-function-use-case';
import { FaasFunctionAssignerService } from './application/service/faas-function-assigner.service';
import { ExecuteFunctionUseCase } from './application/use-case/execute-function-usecase';
import { FunctionExecutionCompletedSubscriber } from './infrastructure/messaging/function-execution-completed-subscriber';
import { MongoFaasFunctionExecutionRepository } from './infrastructure/database/mongo-faasfunction-execution-repository';
import { FunctionExecutionRequestedPublisher } from './infrastructure/messaging/function-execution-requested-publisher';
import { UserModule } from '../user/user.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SqsModule } from '@ssut/nestjs-sqs';
import { GetFunctionsByUserIdUseCase } from './application/use-case/get-functions-by-user-id-use-case';
import { GetFunctionByIdUseCase } from './application/use-case/get-function-by-id-use-case';
 
@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: process.env.FUNCTION_DISPATCHING_QUEUE,
          queueUrl: process.env.FUNCTION_DISPATCHING_QUEUE_URL,
          region: process.env.AWS_REGION,
          //endpoint: process.env.AWS_SQS_ENDPOINT,
        },
      ],
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
    GetFunctionsByUserIdUseCase,
    GetFunctionByIdUseCase,
  ],
})
export class FunctionModule {}