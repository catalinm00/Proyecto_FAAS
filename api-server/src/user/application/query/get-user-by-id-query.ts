export class GetUserByIdQuery {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
