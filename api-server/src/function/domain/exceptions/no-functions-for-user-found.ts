import { NotFoundException } from '@nestjs/common';

export class NoFunctionForUserFoundException extends NotFoundException {
  constructor() {
    super('No functions found for the given userId');
  }
}
