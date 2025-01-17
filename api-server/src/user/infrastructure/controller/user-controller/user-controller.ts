import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdCommand } from '../../../application/command/get-user-by-id-command';
import { GetUserByIdUseCase } from '../../../application/use-case/get-user-by-id-use-case';
import { ApisixService } from 'src/authentication/apisix.service';
import { CreateUserResponse } from '../../../application/response/create-user-response';
import { User } from '../../../domain/model/user';
import { JwtService } from '../../../../authentication/jwt.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  constructor(
    private readonly createUserService: CreateUser,
    private readonly getUserByIdService: GetUserByIdUseCase,
    private readonly apisixService: ApisixService, // Inyectar ApisixService
    private readonly jwtService: JwtService,
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
  async getUserById(@Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    this.logger.log(`Returning user info with ID: ${payload.userId}`);

    const command = new GetUserByIdCommand(payload.userId);
    const response = await this.getUserByIdService.execute(command);

    return {
      email: response.email,
    };
  }
}
