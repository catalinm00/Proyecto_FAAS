import { FaasFunction } from 'src/function/domain/model/faasfunction';

export class GetFunctionByIdResponse {
  readonly functionId: string;
  readonly image: string;

  private constructor(
    functionId: string,
    image: string,
  ) {
    this.functionId = functionId;
    this.image = image;
  }

  static of(func: FaasFunction): GetFunctionByIdResponse {
    return new GetFunctionByIdResponse(
      func.id,
      func.image,
    );
  }
}
