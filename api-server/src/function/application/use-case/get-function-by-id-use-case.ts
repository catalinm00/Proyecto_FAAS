import { Injectable } from '@nestjs/common';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { MongoFaasFunctionRepository } from '../../infrastructure/database/mongo-faasfunction-repository';
import { GetFunctionByIdQuery } from '../query/get-function-by-id-query';
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
    query: GetFunctionByIdQuery,
  ): Promise<GetFunctionByIdResponse> {
    const faasFunction: FaasFunction = await this.functionRepository.findById(
      query.functionId,
    );
    if (!faasFunction) {
      throw new FunctionNotFoundException();
    }

    if (faasFunction.userId !== query.userId) {
      throw new UnauthorizedUserForFunctionException();
    }

    return GetFunctionByIdResponse.of(faasFunction);
  }
}
