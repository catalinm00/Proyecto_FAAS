import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFunctionResponse {
  @ApiProperty({ description: 'Id of the created function' })
  private readonly functionId: string;

  private constructor(functionId: string) {
    this.functionId = functionId;
  }

  static of(func: FaasFunction): CreateFunctionResponse {
    return new CreateFunctionResponse(func.id);
  }
}
