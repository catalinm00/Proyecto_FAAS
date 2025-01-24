import { Injectable } from '@nestjs/common';
import { MongoFaasFunctionRepository } from '../../infrastructure/database/mongo-faasfunction-repository';
import { MongoUserRepository } from '../../../user/infrastructure/database/mongo-user-repository';
import { ExecuteFunctionCommand } from '../command/execute-function-command';
import { ExecuteFunctionResponse } from '../response/execute-function-response';
import { FaasFunction } from '../../domain/model/faasfunction';
import { User } from '../../../user/domain/model/user';
import { FaasFunctionAssignerService } from '../service/faas-function-assigner.service';

@Injectable()
export class ExecuteFunctionUseCase {
  constructor(
    private readonly functionRepository: MongoFaasFunctionRepository,
    private readonly userRepository: MongoUserRepository,
    private readonly assigner: FaasFunctionAssignerService,
  ) {}

  async execute(
    command: ExecuteFunctionCommand,
  ): Promise<ExecuteFunctionResponse> {
    let user: User | null = await this.userRepository.findById(command.userId);
    if (!user) throw new Error('User not found');
    let func: FaasFunction | null = await this.functionRepository.findById(
      command.functionId,
    );
    if (!func) throw new Error('Function not found');
    if (user.id !== func.userId)
      throw new Error('User not allowed to launch function');

    let execution = await this.assigner.assign(func);
    let executionResult = await this.assigner.getResult(execution);
    return new ExecuteFunctionResponse(executionResult.result);
  }
}
