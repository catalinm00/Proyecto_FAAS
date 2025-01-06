import { Module } from '@nestjs/common';
import { FunctionController } from './infrastructure/controller/function-controller/function-controller';
import { MongoFaasFunctionRepository } from './infrastructure/database/mongo-faasfunction-repository';
import { CreateFunctionUseCase } from './application/use-case/create-function-use-case';

@Module({
  imports: [],
  controllers: [FunctionController],
  providers: [MongoFaasFunctionRepository, CreateFunctionUseCase],
})
export class FunctionModule {}
