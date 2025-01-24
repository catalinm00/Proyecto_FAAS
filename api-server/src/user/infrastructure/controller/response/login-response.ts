import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({description: 'User logged successfully.'})
  readonly message: string;
  @ApiProperty({description: 'JWT token'})
  readonly token: string;
}