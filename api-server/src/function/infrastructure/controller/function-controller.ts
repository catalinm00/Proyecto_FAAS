import { Body, Controller, Delete, Get, Logger, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiResponse } from '@nestjs/swagger';
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
import { GetFunctionsByUserIdUseCase } from 'src/function/application/use-case/get-functions-by-user-id-use-case';
import { GetFunctionsByUserIdQuery } from 'src/function/application/command/get-functions-by-user-id-query';
import { CreateFunctionResponse } from '../../application/response/create-function-response';
import { GetFunctionByIdResponse } from '../../application/response/get-function-by-id-response';
import { GetFunctionsByUserIdResponse } from '../../application/response/get-functions-by-user-id-response';


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
    private readonly getFunctionsByUserIdUseCase: GetFunctionsByUserIdUseCase,
  ) {
  }

  @Post()
  @ApiOperation({ summary: 'Creates a function' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Function created successfully.',
    type: CreateFunctionResponse,
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
    return await this.createFunctionService.execute(command);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Removes the function with the specified id' })
  @ApiResponse({
    status: 201,
    description: 'Function deleted successfully.'
  })
  async deleteFunction(@Param('id') id: string, @Request() req) {
    const payload = this.jwtService.decodeToken(
      req.headers.authorization.split(' ')[1],
    );
    this.logger.log(
      `Deleting function with ID: ${id} for user: ${payload.userId}`,
    );

    const command = new DeleteFunctionCommand(
      id,
      payload.userId,
    );
    await this.deleteFunctionService.execute(command);

    return {
      message: 'Function deleted successfully.',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Executes the function with the specified id' })
  @ApiResponse({status: 200, type: String})
  @ApiProduces("text/plain")
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

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Returns all the functions of the current user' })
  @ApiResponse({status: 201, type: [GetFunctionsByUserIdResponse]})
  @Get('/me')
  async getFunctionsByUserId(@Request() req) {
    const payload = this.jwtService.decodeToken(req.headers.authorization.split(' ')[1]);
    const command = new GetFunctionsByUserIdQuery(payload.userId);
    const result = await this.getFunctionsByUserIdUseCase.execute(command);

    return result;

  }

  @Get('/:id')
  @ApiOperation({ summary: 'Returns the function with the specified id' })
  @ApiResponse({
    status: 201,
    description: 'Function returned successfully.',
    type: GetFunctionByIdResponse
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
