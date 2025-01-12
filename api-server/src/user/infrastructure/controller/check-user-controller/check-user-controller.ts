import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from 'src/authentication/auth.service';
import { CreateUserRequest } from '../request/create-user-request';
import { CheckUser } from 'src/user/application/use-case/check-user';
import { CreateUserCommand } from '../../../application/command/create-user-command';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/users/login')
export class loginController {
  private readonly logger = new Logger('UserController');
  //private readonly createUserService: CreateUser;
  /*
    constructor(createUserService: CreateUser) {
      this.createUserService = createUserService;
    }*/
  constructor(
    private readonly checkUserService: CheckUser,
    private readonly authService: AuthService, // Inyectar AuthService
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User logged successfully.',
  })
  async loginUser(@Body() request: CreateUserRequest) {
    this.logger.log('Received request: ' + request.email);

    //Verificar si está registrado
    const command: CreateUserCommand = {
      email: request.email,
      password: request.password,
    };
    await this.checkUserService.execute(command);

    //Generar token usando email como secret
    //ESTO DEBE DE IR EN EL HACER LOGIN
    const token = await this.authService.generateToken({
      /*username: request.email,
            email: request.email,*/
      key: request.email,
      secret: request.password,
    });

    return {
      message: 'User logged successfully.',
      token,
    };
  }
}
