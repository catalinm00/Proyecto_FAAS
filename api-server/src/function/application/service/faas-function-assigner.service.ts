import { Injectable } from '@nestjs/common';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { FaasFunction } from '../../domain/model/faasfunction';
import { FaasFunctionExecution } from '../../domain/model/faasfunction-execution';
import { FaasFunctionExecutionResult } from '../../domain/model/faasfunction-execution-result';
import { MongoFaasFunctionExecutionRepository } from '../../infrastructure/database/mongo-faasfunction-execution-repository';
import { FunctionExecutionRequestedPublisher } from '../../infrastructure/messaging/function-execution-requested-publisher';
import { FunctionExecutionCompletedSubscriber } from '../../infrastructure/messaging/function-execution-completed-subscriber';

@Injectable()
export class FaasFunctionAssignerService {
  constructor(
    private readonly functionExecutionPublisher: FunctionExecutionRequestedPublisher,
    private readonly functionResponseSubscriber: FunctionExecutionCompletedSubscriber,
    private readonly executionRepository: MongoFaasFunctionExecutionRepository,
  ) {}

  async assign(func: FaasFunction): Promise<FaasFunctionExecution> {
    const execution = await this.executionRepository.save(
      FaasFunctionExecution.of(func),
    );
    await this.functionExecutionPublisher.publish(
      FunctionExecutionRequestedEvent.of(execution, func),
    );
    return execution;
  }

  async getResult(
    execution: FaasFunctionExecution,
  ): Promise<FaasFunctionExecutionResult> {
    return new Promise(async (resolve) => {
      const subscription = this.functionResponseSubscriber.subscribe(
        execution.id,
      );
      subscription.subscribe((event) => {
        execution.finish();
        this.executionRepository.save(execution);
        resolve(FaasFunctionExecutionResult.of(event));
      });
    });
  }
}
