import { ApiProperty } from '@nestjs/swagger';

export class CreateFunctionRequest {
  @ApiProperty({
    description: 'Image of the function',
    example: 'hello-world',
  })
  image: string;
}
