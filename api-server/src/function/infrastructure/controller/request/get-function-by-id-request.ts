import { ApiProperty } from '@nestjs/swagger';

export class GetFunctionByIdRequest {
  @ApiProperty({
    description: 'ID of the function to be returned',
    example: '12345',
  })
  functionId: string;

  @ApiProperty({
    description: 'User ID of the function owner',
    example: 'user-123',
  })
  userId: string;
}
