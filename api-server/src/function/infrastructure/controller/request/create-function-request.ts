import { ApiProperty } from '@nestjs/swagger';

export class CreateFunctionRequest {
  @ApiProperty({
    description: 'Image of the function',
    example: 'xyz',
  })
  image: string;
}
