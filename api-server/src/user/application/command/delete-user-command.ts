export class DeleteUserCommand {
    readonly userId: string;
  
    constructor(userId: string) {
      this.userId = userId;
    }
  }