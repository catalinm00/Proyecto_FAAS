import { Injectable } from '@nestjs/common';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { CreateFunctionCommand } from '../command/create-function-command';
import { CreateFunctionResponse } from '../response/create-function-response';
import { FaasFunction } from 'src/function/domain/model/faasfunction';

@Injectable()
export class CreateFunctionUseCase {
  private readonly functionRepository: FaasFunctionRepository;

  constructor(functionRepository: FaasFunctionRepository) {
    this.functionRepository = functionRepository;
  }

  execute(command: CreateFunctionCommand): CreateFunctionResponse {
    let faasFunction: FaasFunction =
      this.functionRepository.findByUserIdAndImage(
        command.userId,
        command.image,
      );
    if (faasFunction) {
      throw new Error('Error - Function already exists!');
    }
    faasFunction = new FaasFunction(command.image, command.userId);
    faasFunction = this.functionRepository.save(faasFunction);
    return CreateFunctionResponse.of(faasFunction);
  }
}
