import { FaasFunction } from 'src/function/domain/model/faasfunction';

export class GetFunctionByIdResponse {
  private readonly functionId: string;

  private constructor(functionId: string) {
    this.functionId = functionId;
  }

  static of(func: FaasFunction): GetFunctionByIdResponse {
    return new GetFunctionByIdResponse(func.id);
  }
}
