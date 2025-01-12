import { User } from '../../domain/model/user';

export class CreateUserResponse {
  constructor(
    readonly id: string,
    readonly email: string,
  ) {}
  static of(user: User): CreateUserResponse {
    return new CreateUserResponse(user.id, user.email);
  }
}
