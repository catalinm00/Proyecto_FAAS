export class GetFunctionByIdCommand {
  readonly functionId: string;
  readonly userId: string;

  constructor(functionId: string, userId: string) {
    this.functionId = functionId;
    this.userId = userId;
  }
}
