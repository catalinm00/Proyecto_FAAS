export class ActivateFunctionEvent {
  constructor(private image: string) {}

  getImage(): string {
    return this.image;
  }
}
