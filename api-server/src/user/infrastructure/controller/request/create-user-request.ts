import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRequest {
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  password: string;
}