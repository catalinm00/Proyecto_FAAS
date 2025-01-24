import { Injectable } from '@nestjs/common';
import { DeleteFunctionCommand } from '../command/delete-function-command';
import { DeleteFunctionResponse } from '../response/delete-function-response';
import { MongoFaasFunctionRepository } from 'src/function/infrastructure/database/mongo-faasfunction-repository';
import { FunctionNotFoundException } from 'src/function/domain/exceptions/function-not-found-exception';
import { UnauthorizedUserForFunctionException } from 'src/function/domain/exceptions/unauthorized-user-for-function-exception';

@Injectable()
export class DeleteFunctionUseCase {
  constructor(
    private readonly functionRepository: MongoFaasFunctionRepository,
  ) {}

  async execute(
    command: DeleteFunctionCommand,
  ): Promise<DeleteFunctionResponse> {
    const func = await this.functionRepository.findById(command.functionId);
    if (!func) {
      throw new FunctionNotFoundException();
    }

    if (func.userId !== command.userId) {
      throw new UnauthorizedUserForFunctionException();
    }

    await this.functionRepository.delete(func);
    return DeleteFunctionResponse.of(true);
  }
}
