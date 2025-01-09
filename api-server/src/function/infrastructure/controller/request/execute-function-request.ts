import { ApiProperty } from '@nestjs/swagger';

export class ExecuteFunctionRequest {
  @ApiProperty({
    example: '1234',
    description: 'Id of the function to be executed',
  })
  functionId: string;
  @ApiProperty({ example: '1234', description: 'Id of the user' })
  userId: string;
}
