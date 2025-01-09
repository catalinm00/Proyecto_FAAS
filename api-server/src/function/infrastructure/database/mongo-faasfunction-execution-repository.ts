import { FaasFunctionExecutionRepository } from '../../domain/repository/faasfunction-execution-repository';
import { FaasFunctionExecution } from '../../domain/model/faasfunction-execution';
import { PrismaService } from '../../../shared/config/db/prisma/PrismaService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoFaasFunctionExecutionRepository
  implements FaasFunctionExecutionRepository
{
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async countUnfinished(): Promise<number> {
    return this.prisma.faasFunctionExecution.count({
      where: {
        finished: false,
      },
    });
  }

  async save(execution: FaasFunctionExecution): Promise<FaasFunctionExecution> {
    let saved = null;
    if (execution.id == undefined) {
      saved = this.prisma.faasFunctionExecution.create({
        data: {
          id: execution.id,
          finished: execution.finished,
          functionId: execution.functionId,
        },
      });
    } else {
      saved = this.prisma.faasFunctionExecution.update({
        where: { id: execution.id },
        data: { finished: execution.finished },
      });
    }
    return new FaasFunctionExecution(
      saved.functionId,
      saved.finished,
      saved.id,
    );
  }

  async findById(executionId: string): Promise<FaasFunctionExecution | null> {
    const result = await this.prisma.faasFunctionExecution.findFirst({
      where: {
        id: executionId,
      },
    });
    if (!result) {
      return null;
    }
    return new FaasFunctionExecution(
      result.functionId,
      result.finished,
      result.id,
    );
  }
}
