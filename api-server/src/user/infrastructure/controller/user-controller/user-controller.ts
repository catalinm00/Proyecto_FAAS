import { Body, Controller, Delete, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdQuery } from '../../../application/query/get-user-by-id-query';
import { GetUserByIdUseCase } from '../../../application/use-case/get-user-by-id-use-case';
import { ApisixService } from 'src/authentication/apisix.service';
import { DeleteUser } from '../../../application/use-case/delete-user';
import { DeleteUserCommand } from '../../../application/command/delete-user-command';

import { CreateUserResponse } from '../../../application/response/create-user-response';
import { User } from '../../../domain/model/user';
import { JwtService } from '../../../../authentication/jwt.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUserByIdResponse } from '../../../application/response/get-user-by-id-response';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  constructor(
    private readonly createUserService: CreateUser,
    private readonly getUserByIdService: GetUserByIdUseCase,
    private readonly apisixService: ApisixService, // Inyectar ApisixService
    private readonly jwtService: JwtService,
    private readonly deleteUser: DeleteUser
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a user' })
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
    const response: CreateUserResponse =
      await this.createUserService.execute(command);
    // Registrar al consumidor en APISIX con el email como secret
    await this.apisixService.registerConsumer(
      new User(response.email, null, response.id),
    );
    return {
      message: 'User created successfully.',
    };
  }
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns the current user\'s data' })
  @ApiResponse({status: 200, type: GetUserByIdResponse})
  async getUserById(@Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    this.logger.log(`Returning user info with ID: ${payload.userId}`);

    const query = new GetUserByIdQuery(payload.userId);
    const response = await this.getUserByIdService.execute(query);

    return response;
  }

  @Delete('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Deletes the current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'User deleted successfully.',
  })
  async deleteUserEndpoint(@Request() req){
    const payload = this.jwtService.decodeToken(req.headers.authorization.split(' ')[1]);
    
    await this.apisixService.deleteConsumer(payload.userId);
    const command = new DeleteUserCommand(payload.userId);
    this.logger.log(`Deleting user with ID: ${command.userId}`);
    const response=await this.deleteUser.execute(command);
    return {
      message: response.message,
    };
  }

}
