import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserRequest {
  @ApiProperty({
    description: 'User ID',
    example: '3523523',
  })
  userid: string;
}