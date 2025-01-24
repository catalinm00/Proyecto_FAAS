import { Body, Controller, Delete, Get, Logger, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFunctionUseCase } from 'src/function/application/use-case/create-function-use-case';
import { CreateFunctionRequest } from './request/create-function-request';
import { CreateFunctionCommand } from 'src/function/application/command/create-function-command';
import { DeleteFunctionCommand } from 'src/function/application/command/delete-function-command';
import { DeleteFunctionRequest } from './request/delete-function-request';
import { DeleteFunctionUseCase } from 'src/function/application/use-case/delete-function-use-case';
import { ExecuteFunctionUseCase } from '../../application/use-case/execute-function-usecase';
import { ExecuteFunctionCommand } from '../../application/command/execute-function-command';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '../../../authentication/jwt.service';
import { GetFunctionByIdUseCase } from 'src/function/application/use-case/get-function-by-id-use-case';
import { GetFunctionByIdQuery } from 'src/function/application/query/get-function-by-id-query';

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
  ) {}

  @Post()
  @ApiOperation({summary: "Creates a function"})
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
  @ApiOperation({summary: "Removes the function with the specified id"})
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
  @ApiOperation({summary: "Executes the function with the specified id"})
  @Post('/:id')
  async executeFunction(
    @Param('id') id: string,
    @Request() req,
  ) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    const command: ExecuteFunctionCommand = new ExecuteFunctionCommand(
      id,
      payload.userId,
    );
    const result = await this.executeFunctionService.execute(command);
    return result.result;
  }

  @Get('/:id')
  @ApiOperation({summary: "Returns the function with the specified id"})
  @ApiResponse({
    status: 201,
    description: 'Function returned successfully.',
  })
  async getFunctionById(@Param('id') functionId: string, @Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );

    this.logger.log(
      `Returning function with ID: ${functionId} for user: ${payload.userId}`,
    );

    const query = new GetFunctionByIdQuery(functionId, payload.userId);
    const response = await this.getFunctionByIdService.execute(query);

    return response;
  }
}
