import { Event } from '../event';
import { FaasFunction } from '../../model/faasfunction';
import { FaasFunctionExecution } from '../../model/faasfunction-execution';

export class FunctionExecutionRequestedEvent implements Event {
  private constructor(readonly executionId: string, readonly func: FaasFunction) {}

  static of(execution: FaasFunctionExecution): FunctionExecutionRequestedEvent {
    return new FunctionExecutionRequestedEvent(execution.id, execution.functionId);
  }
}