import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/functions')
export class FunctionController {
  private readonly logger = new Logger('FunctionController');

  constructor(private readonly createFunctionService: CreateFunctionUseCase) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Function created successfully.',
  })
  async createFunction(@Body() request: CreateFunctionRequest) {
    this.logger.log('Received request: ' + request.email);

    const command: CreateFunctionCommand = {
      image: request.image,
      userId: request.userId,
    };
    await this.createFunctionService.execute(command);

    return {
      message: 'Function created successfully.',
    };
  }
}
