import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { User } from '../../domain/model/user';
import { MongoUserRepository } from '../../infrastructure/database/mongo-user-repository';
import { GetUserByIdQuery } from '../query/get-user-by-id-query';
import { GetUserByIdResponse } from '../response/get-user-by-id-response';
import { UserNotFoundException } from 'src/user/domain/exceptions/user-not-found-exception';

@Injectable()
export class GetUserByIdUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: MongoUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResponse> {
    const User: User = await this.userRepository.findById(query.userId);
    if (!User) {
      throw new UserNotFoundException();
    }
    return GetUserByIdResponse.of(User);
  }
}
