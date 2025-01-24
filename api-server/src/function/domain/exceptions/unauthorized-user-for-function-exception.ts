import { ForbiddenException } from '@nestjs/common';

export class UnauthorizedUserForFunctionException extends ForbiddenException {
  constructor() {
    super('Unauthorized: You do not own this function');
  }
}
