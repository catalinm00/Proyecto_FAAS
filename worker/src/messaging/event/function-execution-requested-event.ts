import { FaasFunction } from '../../model/faas-function';

export class FunctionExecutionRequestedEvent {
  private constructor(readonly executionId: string, readonly func: FaasFunction) {}
}