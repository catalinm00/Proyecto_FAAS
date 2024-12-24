import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { MongoUserRepository } from '../../infrastructure/database/mongo-user-repository';
import { CreateUserCommand } from '../command/create-user-command';
import { User } from '../../domain/model/user';
import { VoidResponse } from '../response/void-response';
import { CryptographyService } from '../service/cryptography-service';
import { BcryptService } from '../../infrastructure/config/criptography/bcrypt-service';

@Injectable()
export class CreateUser {
  private readonly userRepository: UserRepository;
  private readonly cryptographyService: CryptographyService;


  constructor(
    cryptographyService: BcryptService,
    userRepository: MongoUserRepository) {
    this.cryptographyService = cryptographyService;
    this.userRepository = userRepository;
  }

  async execute(command: CreateUserCommand): Promise<VoidResponse> {
    const user: User = await this.userRepository.findByEmail(command.email);
    if (user) {
      throw Error('User already exists');
    }
    let encryptedPassword = await this.cryptographyService.encrypt(command.password);
    await this.userRepository.save(new User(command.email, encryptedPassword));

    return {};
  }
}