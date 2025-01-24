import { ApiProperty } from '@nestjs/swagger';

export class GetFunctionsByUserIdResponse {
  @ApiProperty({ description: 'Id of the function' })
  private readonly id: string;
  @ApiProperty({ description: 'Image of the function' })
  private readonly image: string;

  private constructor(id: string, image: string) {
    this.id = id;
    this.image = image;
  }

  static of(id: string, name: string): GetFunctionsByUserIdResponse {
    return new GetFunctionsByUserIdResponse(id, name);
  }
}