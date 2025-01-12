import { User } from '@prisma/client';

export class CheckUserResponse {
  private constructor(readonly email: string, readonly id: string) {}

  static of(user: User): CheckUserResponse {
    return new CheckUserResponse(user.email, user.id);
  }
}