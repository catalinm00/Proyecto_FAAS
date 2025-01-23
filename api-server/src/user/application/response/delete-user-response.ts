export class DeleteUserResponse {
    private readonly success: boolean;
  
    private constructor(success: boolean) {
      this.success = success;
    }
  
    static of(success: boolean): DeleteUserResponse {
      return new DeleteUserResponse(success);
    }
  }