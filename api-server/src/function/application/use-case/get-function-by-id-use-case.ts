import { Injectable } from '@nestjs/common';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { MongoFaasFunctionRepository } from '../../infrastructure/database/mongo-faasfunction-repository';
import { GetFunctionByIdCommand } from '../command/get-function-by-id-command';
import { GetFunctionByIdResponse } from '../response/get-function-by-id-response';
import { UnauthorizedUserForFunctionException } from 'src/function/domain/exceptions/unauthorized-user-for-function-exception';
import { FunctionNotFoundException } from 'src/function/domain/exceptions/function-not-found-exception';

@Injectable()
export class GetFunctionByIdUseCase {
  private readonly functionRepository: FaasFunctionRepository;

  constructor(functionRepository: MongoFaasFunctionRepository) {
    this.functionRepository = functionRepository;
  }

  async execute(
    command: GetFunctionByIdCommand,
  ): Promise<GetFunctionByIdResponse> {
    const faasFunction: FaasFunction = await this.functionRepository.findById(
      command.functionId,
    );
    if (!faasFunction) {
      throw FunctionNotFoundException;
    }

    if (faasFunction.userId !== command.userId) {
      throw UnauthorizedUserForFunctionException;
    }

    return GetFunctionByIdResponse.of(faasFunction);
  }
}
