import { FaasFunction } from 'src/function/domain/model/faasfunction';

export class CreateFunctionResponse {
  private readonly functionId: string;

  private constructor(functionId: string) {
    this.functionId = functionId;
  }

  static of(func: FaasFunction): CreateFunctionResponse {
    return new CreateFunctionResponse(func.id);
  }
}
