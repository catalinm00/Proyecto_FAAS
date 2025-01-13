import { ApiProperty } from '@nestjs/swagger';

export class DeleteFunctionRequest {
  @ApiProperty({
    description: 'ID of the function to delete',
    example: '12345',
  })
  functionId: string;
}
