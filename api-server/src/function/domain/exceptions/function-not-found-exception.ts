import { NotFoundException } from '@nestjs/common';

export class FunctionNotFoundException extends NotFoundException {
  constructor() {
    super('Function not found');
  }
}
