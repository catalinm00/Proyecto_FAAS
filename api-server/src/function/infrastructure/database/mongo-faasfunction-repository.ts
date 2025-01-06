import { Injectable } from '@nestjs/common';
import { FaasFunction } from 'src/function/domain/model/faasfunction';
import { FaasFunctionRepository } from 'src/function/domain/repository/faasfunction-repository';
import { PrismaService } from 'src/shared/config/db/prisma/PrismaService';

@Injectable()
export class MongoFaasFunctionRepository implements FaasFunctionRepository {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async save(func: FaasFunction): Promise<FaasFunction> {
    const savedFunction = await this.prisma.fasFunction.create({
      data: {
        id: func.id,
        userId: func.userId,
        image: func.image,
        active: func.active,
      },
    });
    return new FaasFunction(
      savedFunction.image,
      savedFunction.userId,
      savedFunction.id,
    );
  }

  async findByUserId(userId: string): Promise<FaasFunction[] | null> {
    const functions = await this.prisma.fasFunction.findMany({
      where: {
        userId: userId,
      },
    });
    return functions.length > 0
      ? functions.map(
          (func) => new FaasFunction(func.image, func.userId, func.id),
        )
      : null;
  }

  async findById(id: string): Promise<FaasFunction | null> {
    const func = await this.prisma.fasFunction.findFirst({
      where: {
        id: id,
      },
    });
    return func ? new FaasFunction(func.image, func.userId, func.id) : null;
  }

  async findByUserIdAndImage(
    userId: string,
    image: string,
  ): Promise<FaasFunction | null> {
    const func = await this.prisma.fasFunction.findFirst({
      where: {
        userId: userId,
        image: image,
      },
    });
    return func ? new FaasFunction(func.image, func.userId, func.id) : null;
  }

  async delete(func: FaasFunction): Promise<FaasFunction> {
    await this.prisma.fasFunction.delete({
      where: {
        id: func.id,
      },
    });
    return func;
  }
}
