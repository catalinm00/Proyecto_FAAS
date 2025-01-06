import { Injectable } from '@nestjs/common';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { CreateFunctionCommand } from '../command/create-function-command';
import { CreateFunctionResponse } from '../response/create-function-response';
import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { MongoFaasFunctionRepository } from '../../infrastructure/database/mongo-faasfunction-repository';

@Injectable()
export class CreateFunctionUseCase {
  private readonly functionRepository: FaasFunctionRepository;

  constructor(functionRepository: MongoFaasFunctionRepository) {
    this.functionRepository = functionRepository;
  }

  async execute(
    command: CreateFunctionCommand,
  ): Promise<CreateFunctionResponse> {
    let faasFunction: FaasFunction =
      await this.functionRepository.findByUserIdAndImage(
        command.userId,
        command.image,
      );
    if (faasFunction) {
      throw new Error('Error - Function already exists!');
    }
    faasFunction = new FaasFunction(command.image, command.userId);
    faasFunction = await this.functionRepository.save(faasFunction);
    return CreateFunctionResponse.of(faasFunction);
  }
}
