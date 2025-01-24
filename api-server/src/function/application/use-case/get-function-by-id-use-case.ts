import { Injectable } from '@nestjs/common';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { MongoFaasFunctionRepository } from '../../infrastructure/database/mongo-faasfunction-repository';
import { GetFunctionByIdQuery } from '../query/get-function-by-id-query';
import { GetFunctionByIdResponse } from '../response/get-function-by-id-response';

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
      throw new Error('Function not found');
    }

    if (faasFunction.userId !== query.userId) {
      throw new Error('Unauthorized: You do not own this function');
    }

    return GetFunctionByIdResponse.of(faasFunction);
  }
}
