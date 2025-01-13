import { User } from '../../domain/model/user';

export class GetUserByIdResponse {
  readonly userId: string;
  readonly email: string;
  readonly password: string;

  private constructor(userId: string, email: string, password: string) {
    this.userId = userId;
    this.email = email;
    this.password = password;
  }

  static of(user: User): GetUserByIdResponse {
    return new GetUserByIdResponse(user.id, user.email, user.password);
  }
}