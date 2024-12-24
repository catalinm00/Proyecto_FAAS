import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user-repository';
import { PrismaService } from '../../../shared/config/db/prisma/PrismaService';
import { User } from '../../domain/model/user';

@Injectable()
export class MongoUserRepository implements UserRepository {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async delete(user: User): Promise<void> {
    this.prisma.user.delete({
      where: {
        id: user.id,
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });
    if (!result) {return null}
    return new User(result.email, result.password, result.id);
  }

  async save(user: User): Promise<User> {
    const result = await this.prisma.user.create({data: {
      email: user.email, password: user.password, id: undefined
      }});
    return new User(result.email, result.password, result.id);
  }


}