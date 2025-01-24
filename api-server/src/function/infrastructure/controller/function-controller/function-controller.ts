import {
  Body,
  Controller,
  Logger,
  Post,
  Delete,
  UseGuards,
  Get,
  Request,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateFunctionUseCase } from 'src/function/application/use-case/create-function-use-case';
import { CreateFunctionRequest } from '../request/create-function-request';
import { CreateFunctionCommand } from 'src/function/application/command/create-function-command';
import { DeleteFunctionCommand } from 'src/function/application/command/delete-function-command';
import { DeleteFunctionRequest } from '../request/delete-function-request';
import { DeleteFunctionUseCase } from 'src/function/application/use-case/delete-function-use-case';
import { ExecuteFunctionRequest } from '../request/execute-function-request';
import { ExecuteFunctionUseCase } from '../../../application/use-case/execute-function-usecase';
import { ExecuteFunctionCommand } from '../../../application/command/execute-function-command';
import { GetFunctionsByUserIdUseCase } from 'src/function/application/use-case/get-functions-by-user-id-use-case';
import { GetFunctionsByUserIdQuery } from 'src/function/application/command/get-functions-by-user-id-query';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '../../../../authentication/jwt.service';
import { GetFunctionByIdUseCase } from 'src/function/application/use-case/get-function-by-id-use-case';
import { GetFunctionByIdCommand } from 'src/function/application/command/get-function-by-id-command';

@ApiBearerAuth()
@Controller('api/v1/functions')
export class FunctionController {
  private readonly logger = new Logger('FunctionController');

  constructor(
    private readonly createFunctionService: CreateFunctionUseCase,
    private readonly deleteFunctionService: DeleteFunctionUseCase,
    private readonly getFunctionByIdService: GetFunctionByIdUseCase,
    private readonly executeFunctionService: ExecuteFunctionUseCase,
    private readonly jwtService: JwtService,
    private readonly getFunctionsByUserIdUseCase: GetFunctionsByUserIdUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Function created successfully.',
  })
  async createFunction(@Body() request: CreateFunctionRequest, @Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    this.logger.log('Received request: ' + request.image + payload.userId);
    const command: CreateFunctionCommand = {
      image: request.image,
      userId: payload.userId,
    };
    await this.createFunctionService.execute(command);

    return {
      message: 'Function created successfully.',
    };
  }

  @Delete() ///functions/{id}
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Function deleted successfully.',
  })
  async deleteFunction(@Body() request: DeleteFunctionRequest, @Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    this.logger.log(
      `Deleting function with ID: ${request.functionId} for user: ${payload.userId}`,
    );

    const command = new DeleteFunctionCommand(
      request.functionId,
      payload.userId,
    );
    await this.deleteFunctionService.execute(command);

    return {
      message: 'Function deleted successfully.',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/execute')
  async executeFunction(
    @Body() request: ExecuteFunctionRequest,
    @Request() req,
  ) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    const command: ExecuteFunctionCommand = new ExecuteFunctionCommand(
      request.functionId,
      payload.userId,
    );
    const result = await this.executeFunctionService.execute(command);
    return result.result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getFunctionsByUserId(@Request() req) {
      const payload = this.jwtService.decodeToken(req.headers.authorization.split(' ')[1]);
      const command = new GetFunctionsByUserIdQuery(payload.userId);
      const result = await this.getFunctionsByUserIdUseCase.execute(command);  

      return result;
  
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get() ///functions/{id}
  @ApiResponse({
    status: 201,
    description: 'Function returned successfully.',
  })
  async getFunctionById(@Param('idFunction') functionId: string, @Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );

    this.logger.log(
      `Returning function with ID: ${functionId} for user: ${payload.userId}`,
    );

    const command = new GetFunctionByIdCommand(functionId, payload.userId);
    const response = await this.getFunctionByIdService.execute(command);

    return {
      message: 'Function returned successfully.',
      id: response.functionId,
      image: response._image,
      userId: response._userId,
      active: response._active,
    };
  }
}
