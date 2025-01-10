import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from 'src/authentication/auth.service';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CheckUser } from 'src/user/application/use-case/check-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiResponse } from '@nestjs/swagger';
import { ApisixService } from 'src/authentication/apisix.service';

@Controller('api/v1/users')
export class UserController {
  private readonly logger = new Logger('UserController');
  //private readonly createUserService: CreateUser;
  /*
  constructor(createUserService: CreateUser) {
    this.createUserService = createUserService;
  }*/
  constructor(
    private readonly createUserService: CreateUser,
    private readonly apisixService: ApisixService, // Inyectar ApisixService
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created hola successfully.',
  })
  async createUser(@Body() request: CreateUserRequest) {
    this.logger.log('Received request: ' + request.email);

    const command: CreateUserCommand = {
      email: request.email,
      password: request.password,
    };
    await this.createUserService.execute(command);

    // Registrar al consumidor en APISIX con el email como secret
    // AÑADIR EL ID??
    /*await this.apisixService.registerConsumer(
      request.email, // username en APISIX
    );
    await this.apisixService.createGlobalProtectedRoute();*/

    return {
      message: 'User created successfully.',
    };
  }
}
