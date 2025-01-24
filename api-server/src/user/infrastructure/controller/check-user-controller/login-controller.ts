import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from 'src/authentication/auth.service';
import { CreateUserRequest } from '../request/create-user-request';
import { CheckUser } from 'src/user/application/use-case/check-user';
import { CheckUserCommand } from '../../../application/command/check-user-command';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../../../domain/model/user';
import { LoginUserResponse } from '../response/login-response';

@Controller('api/v1/users/login')
export class LoginController {
  private readonly logger = new Logger('UserController');

  constructor(
    private readonly checkUserService: CheckUser,
    private readonly authService: AuthService, // Inyectar AuthService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a JWT using the credentials of the user' })
  @ApiResponse({
    status: 201,
    description: 'User logged successfully.',
    type: LoginUserResponse,
  })
  async loginUser(@Body() request: CreateUserRequest) {
    this.logger.log('Received request: ' + request.email);

    //Verificar si está registrado
    const command: CheckUserCommand = {
      email: request.email,
      password: request.password,
    };
    const checkUserResponse = await this.checkUserService.execute(command);

    //Generar token usando email como secret
    //ESTO DEBE DE IR EN EL HACER LOGIN
    const token = await this.authService.generateToken(
      new User(command.email, command.password, checkUserResponse.id),
    );

    const response: LoginUserResponse = {
      message: 'User logged successfully.',
      token: token,
    };
    return response;
  }
}
