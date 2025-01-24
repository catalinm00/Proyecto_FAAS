import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super('User already exists');
  }
}
