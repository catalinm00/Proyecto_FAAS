import { Module } from '@nestjs/common';
import { FunctionController } from './infrastructure/controller/function-controller/function-controller';
import { MongoFaasFunctionRepository } from './infrastructure/database/mongo-faasfunction-repository';
import { CreateFunctionUseCase } from './application/use-case/create-function-use-case';
import { DeleteFunctionUseCase } from './application/use-case/delete-function-use-case';

@Module({
  imports: [],
  controllers: [FunctionController],
  providers: [MongoFaasFunctionRepository, CreateFunctionUseCase, DeleteFunctionUseCase],
})
export class FunctionModule {}
