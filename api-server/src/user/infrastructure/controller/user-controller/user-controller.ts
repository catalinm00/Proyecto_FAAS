import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  private readonly createUserService: CreateUser;

  constructor(createUserService: CreateUser) {
    this.createUserService = createUserService;
  }

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    this.logger.log("Received request: " + request);
    const command: CreateUserCommand = { email: request.email, password: request.password };
    await this.createUserService.execute(command);
    return {message: 'User created successfully.'};
  }
}
