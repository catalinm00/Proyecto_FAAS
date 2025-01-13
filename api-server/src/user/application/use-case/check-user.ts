import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { MongoUserRepository } from '../../infrastructure/database/mongo-user-repository';
import { CheckUserCommand } from '../command/check-user-command';
import { User } from '../../domain/model/user';
import { VoidResponse } from '../response/void-response';
import { CryptographyService } from '../service/cryptography-service';
import { BcryptService } from '../../infrastructure/config/criptography/bcrypt-service';
import { CheckUserResponse } from '../response/check-user-response';

@Injectable()
export class CheckUser {
  private readonly userRepository: UserRepository;
  private readonly cryptographyService: CryptographyService;
  constructor(
    cryptographyService: BcryptService,
    userRepository: MongoUserRepository,
  ) {
    this.cryptographyService = cryptographyService;
    this.userRepository = userRepository;
  }

  async execute(command: CheckUserCommand): Promise<CheckUserResponse> {
    const user: User = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Comparar la contraseña ingresada con la almacenada
    const passwordMatches = await this.cryptographyService.compare(
      command.password,
      user.password, // Contraseña almacenada en la base de datos
    );
    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    return CheckUserResponse.of(user);
  }
}
