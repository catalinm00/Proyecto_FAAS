export class User {
  private readonly _id: string;
  private _email: string;
  private _password: string;

  constructor(email: string, password: string, id?: string) {
    this._email = email;
    this._password = password;
    this._id = id;
  }


  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  set email(value: string) {
    this._email = value;
  }

  set password(value: string) {
    this._password = value;
  }
}