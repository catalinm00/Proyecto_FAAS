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
    let savedFunction;
    if (func.id === undefined) {
      savedFunction = await this.prisma.faasFunction.create({
        data: {
          userId: func.userId,
          image: func.image,
          active: func.active,
        },
      });
    } else {
      savedFunction = await this.prisma.faasFunction.update({
        where: { id: func.id },
        data: {
          userId: func.userId,
          image: func.image,
          active: func.active,
        },
      });
    }
    return new FaasFunction(
      savedFunction.image,
      savedFunction.userId,
      savedFunction.id,
    );
  }

  async findByUserId(userId: string): Promise<FaasFunction[] | null> {
    const functions = await this.prisma.faasFunction.findMany({
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
    const func = await this.prisma.faasFunction.findFirst({
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
    const func = await this.prisma.faasFunction.findFirst({
      where: {
        userId: userId,
        image: image,
      },
    });
    return func ? new FaasFunction(func.image, func.userId, func.id) : null;
  }

  async delete(func: FaasFunction): Promise<FaasFunction> {
    await this.prisma.faasFunction.delete({
      where: {
        id: func.id,
      },
    });
    return func;
  }
}
