import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateFunctionUseCase } from 'src/function/application/use-case/create-function-use-case';
import { CreateFunctionRequest } from '../request/create-function-request';
import { CreateFunctionCommand } from 'src/function/application/command/create-function-command';
import { DeleteFunctionCommand } from 'src/function/application/command/delete-function-command';
import { DeleteFunctionRequest} from '../request/delete-function-request';
import { DeleteFunctionUseCase } from 'src/function/application/use-case/delete-function-use-case'; 

@Controller('api/v1/functions')
export class FunctionController {
  private readonly logger = new Logger('FunctionController');

  constructor(
    private readonly createFunctionService: CreateFunctionUseCase,
    private readonly deleteFunctionService: DeleteFunctionUseCase,
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

  @Delete()
  @ApiResponse({
    status: 201,
    description: 'Function deleted successfully.',
  })
  async deleteFunction(
    @Body('functionId') functionId: string,
    @Body('userId') userId: string,
  ) {
    this.logger.log(`Deleting function with ID: ${functionId} for user: ${userId}`);

    const command = new DeleteFunctionCommand(functionId, userId);
    await this.deleteFunctionService.execute(command);

    return {
      message: 'Function deleted successfully.',
    };
  }
}
