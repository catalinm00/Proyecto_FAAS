import { Body, Controller, Logger, Post, Delete } from '@nestjs/common';
import { AuthService } from 'src/authentication/auth.service';
import { CreateUserRequest } from '../request/create-user-request';
import { CreateUser } from '../../../application/use-case/create-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiResponse } from '@nestjs/swagger';
import { ApisixService } from 'src/authentication/apisix.service';
import { DeleteUser } from '../../application/use-case/delete-user';
import { DeleteUserRequest } from '../controller/request/delete-user-request';
import { DeleteUserCommand } from '../../../application/command/delete-user-command';


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
    private readonly authService: AuthService, // Inyectar AuthService
    private readonly apisixService: ApisixService, // Inyectar ApisixService
    private readonly deleteUser: DeleteUser
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

    //Generar token usando email como secret
    const token = await this.authService.generateToken({
      username: request.email,
      email: request.email,
    });

    // Registrar al consumidor en APISIX con el email como secret
    await this.apisixService.registerConsumer(
      request.email, // username en APISIX
    );
    await this.apisixService.createGlobalProtectedRoute();

    return {
      message: 'User created successfully.',
      token,
    };
  }

  @Delete()
  @ApiResponse({
    status: 201,
    description: 'User deleted successfully.',
  })
  async deleteUserEndpoint(@Body() deleteUserRequest: DeleteUserRequest){
    const command = new DeleteUserCommand(deleteUserRequest.userid);
    await this.deleteUser.execute(command);
  }

}
