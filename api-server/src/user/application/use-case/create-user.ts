import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { MongoUserRepository } from '../../infrastructure/database/mongo-user-repository';
import { CreateUserCommand } from '../command/create-user-command';
import { User } from '../../domain/model/user';
import { CryptographyService } from '../service/cryptography-service';
import { BcryptService } from '../../infrastructure/config/criptography/bcrypt-service';
import { CreateUserResponse } from '../response/create-user-response';
import { UserAlreadyExistsException } from 'src/user/domain/exceptions/user-already-exists-exception';

@Injectable()
export class CreateUser {
  private readonly userRepository: UserRepository;
  private readonly cryptographyService: CryptographyService;

  constructor(
    cryptographyService: BcryptService,
    userRepository: MongoUserRepository,
  ) {
    this.cryptographyService = cryptographyService;
    this.userRepository = userRepository;
  }

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    let user: User = await this.userRepository.findByEmail(command.email);
    if (user) {
      throw new UserAlreadyExistsException();
    }
    const encryptedPassword = await this.cryptographyService.encrypt(
      command.password,
    );
    user = await this.userRepository.save(
      new User(command.email, encryptedPassword),
    );

    return CreateUserResponse.of(user);
  }
}
