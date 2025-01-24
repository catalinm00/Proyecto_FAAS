import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { ApiProperty } from '@nestjs/swagger';

export class GetFunctionByIdResponse {
  @ApiProperty({ description: 'Id of the function' })
  readonly functionId: string;
  @ApiProperty({ description: 'Image of the function' })
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
