export class GetUserByIdCommand {
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
