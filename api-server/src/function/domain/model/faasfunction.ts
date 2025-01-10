export class FaasFunction {
  private readonly _id: string;
  private readonly _image: string;
  private readonly _userId: string;
  private _active: boolean;

  constructor(image: string, userId: string, id?: string) {
    this._image = image;
    this._active = false;
    this._userId = userId;
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get image(): string {
    return this._image;
  }

  get userId(): string {
    return this._userId;
  }

  get active(): boolean {
    return this._active;
  }

  set active(ac: boolean) {
    this._active = ac;
  }
}
