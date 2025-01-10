import { Body, Controller, Logger, Post, Delete, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateFunctionUseCase } from 'src/function/application/use-case/create-function-use-case';
import { CreateFunctionRequest } from '../request/create-function-request';
import { CreateFunctionCommand } from 'src/function/application/command/create-function-command';
import { DeleteFunctionCommand } from 'src/function/application/command/delete-function-command';
import { DeleteFunctionRequest } from '../request/delete-function-request';
import { DeleteFunctionUseCase } from 'src/function/application/use-case/delete-function-use-case';
import { GetFunctionByIdRequest } from '../request/get-function-by-id-request';
import { GetFunctionByIdCommand } from 'src/function/application/command/get-function-by-id-command';
import { GetFunctionByIdUseCase } from 'src/function/application/use-case/get-function-by-id-use-case';

@Controller('api/v1/functions')
export class FunctionController {
  private readonly logger = new Logger('FunctionController');

  constructor(
    private readonly createFunctionService: CreateFunctionUseCase,
    private readonly deleteFunctionService: DeleteFunctionUseCase,
    private readonly getFunctionByIdService: GetFunctionByIdUseCase,
  ) {}

  @Post()
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

  @Get() ///functions/{id}
  @ApiResponse({
    status: 201,
    description: 'Function returned successfully.',
  })
  async getFunctionById(@Body() request: GetFunctionByIdRequest) {
    this.logger.log(
      `Returning function with ID: ${request.functionId} for user: ${request.userId}`,
    );

    const command = new GetFunctionByIdCommand(
      request.functionId,
      request.userId,
    );
    await this.getFunctionByIdService.execute(command);

    return {
      message: 'Function returned successfully.',
    };
  }
}
