import { ConflictException } from '@nestjs/common';

export class FunctionAlreadyExistsException extends ConflictException {
  constructor() {
    super('Function already exists');
  }
}
