import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdCommand } from '../../../application/command/get-user-by-id-command';
import { GetUserByIdUseCase } from '../../../application/use-case/get-user-by-id-use-case';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  constructor(
    private readonly createUserService: CreateUser,
    private readonly getUserByIdService: GetUserByIdUseCase,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  async createUser(@Body() request: CreateUserRequest) {
    this.logger.log('Received request: ' + request.email);

    const command: CreateUserCommand = {
      email: request.email,
      password: request.password,
    };
    await this.createUserService.execute(command);
    return {
      message: 'User created successfully.',
    };
  }
  @Get('/info/:id')
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string) {
    this.logger.log(`Returning user info with ID: ${id}`);

    const command = new GetUserByIdCommand(id);
    const response = await this.getUserByIdService.execute(command);

    return {
      email: response.email,
    };
  }
}
