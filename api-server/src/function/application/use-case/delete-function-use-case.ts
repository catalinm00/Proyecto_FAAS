import { Injectable } from '@nestjs/common';
import { DeleteFunctionCommand } from '../command/delete-function-command';
import { DeleteFunctionResponse } from '../response/delete-function-response';
import { MongoFaasFunctionRepository } from 'src/function/infrastructure/database/mongo-faasfunction-repository';

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
      throw new Error('Function not found');
    }

    if (func.userId !== command.userId) {
      throw new Error('Unauthorized: You do not own this function');
    }

    await this.functionRepository.delete(func);
    return DeleteFunctionResponse.of(true);
  }
}
