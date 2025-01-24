import { FaasFunction } from 'src/function/domain/model/faasfunction';

export class GetFunctionByIdResponse {
  readonly functionId: string;
  _image: string;
  _active: boolean;
  _userId: string;

  private constructor(
    functionId: string,
    image: string,
    active: boolean,
    userId: string,
  ) {
    this.functionId = functionId;
    this._image = image;
    this._active = active;
    this._userId = userId;
  }

  static of(func: FaasFunction): GetFunctionByIdResponse {
    return new GetFunctionByIdResponse(
      func.id,
      func.image,
      func.active,
      func.userId,
    );
  }
}
