import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { User } from '../../domain/model/user';
import { MongoUserRepository } from '../../infrastructure/database/mongo-user-repository';
import { GetUserByIdCommand } from '../command/get-user-by-id-command';
import { GetUserByIdResponse } from '../response/get-user-by-id-response';
import { UserNotFoundException } from 'src/user/domain/exceptions/user-not-found-exception';

@Injectable()
export class GetUserByIdUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: MongoUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(command: GetUserByIdCommand): Promise<GetUserByIdResponse> {
    const User: User = await this.userRepository.findById(command.userId);
    if (!User) {
      throw UserNotFoundException;
    }
    return GetUserByIdResponse.of(User);
  }
}
