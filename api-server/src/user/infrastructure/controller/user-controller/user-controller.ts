import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  private readonly createUserService: CreateUser;

  constructor(createUserService: CreateUser) {
    this.createUserService = createUserService;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  async createUser(@Body() request: CreateUserRequest) {
    this.logger.log("Received request: " + request.email);
    const command: CreateUserCommand = { email: request.email, password: request.password };
    await this.createUserService.execute(command);
    return {message: 'User created successfully.'};
  }
}
