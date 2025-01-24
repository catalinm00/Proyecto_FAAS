import { User } from '../../domain/model/user';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserByIdResponse {
  @ApiProperty()
  readonly userId: string;
  @ApiProperty()
  readonly email: string;


  private constructor(userId: string, email: string) {
    this.userId = userId;
    this.email = email;
  }

  static of(user: User): GetUserByIdResponse {
    return new GetUserByIdResponse(user.id, user.email);
  }
}