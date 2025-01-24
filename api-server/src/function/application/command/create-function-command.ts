export class CreateFunctionCommand {
  readonly userId: string;
  readonly image: string;

  constructor(image: string, userId: string) {
    this.image = image;
    this.userId = userId;
  }
}
