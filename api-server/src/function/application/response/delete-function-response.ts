export class DeleteFunctionResponse {
  private readonly success: boolean;

  private constructor(success: boolean) {
    this.success = success;
  }

  static of(success: boolean): DeleteFunctionResponse {
    return new DeleteFunctionResponse(success);
  }
}
