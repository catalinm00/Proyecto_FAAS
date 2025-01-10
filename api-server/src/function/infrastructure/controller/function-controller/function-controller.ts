import {
  Body,
  Controller,
  Logger,
  Post,
  Delete,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/functions')
export class FunctionController {
  private readonly logger = new Logger('FunctionController');

  constructor(
    private readonly createFunctionService: CreateFunctionUseCase,
    private readonly deleteFunctionService: DeleteFunctionUseCase,
    private readonly executeFunctionService: ExecuteFunctionUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Function created successfully.',
  })
  async createFunction(@Body() request: CreateFunctionRequest) {
    this.logger.log('Received request: ' + request.image + request.userId);

    const command: CreateFunctionCommand = {
      image: request.image,
      userId: request.userId,
    };
    await this.createFunctionService.execute(command);

    return {
      message: 'Function created successfully.',
    };
  }

  @Delete() ///functions/{id}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Function deleted successfully.',
  })
  async deleteFunction(@Body() request: DeleteFunctionRequest) {
    this.logger.log(
      `Deleting function with ID: ${request.functionId} for user: ${request.userId}`,
    );

    const command = new DeleteFunctionCommand(
      request.functionId,
      request.userId,
    );
    await this.deleteFunctionService.execute(command);

    return {
      message: 'Function deleted successfully.',
    };
  }

  @Post('/execute')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async executeFunction(@Body() request: ExecuteFunctionRequest) {
    const command: ExecuteFunctionCommand = new ExecuteFunctionCommand(
      request.functionId,
      request.userId,
    );
    const result = await this.executeFunctionService.execute(command);
    return result.result;
  }
}
