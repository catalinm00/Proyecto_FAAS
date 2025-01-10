import { FunctionExecutionCompletedEvent } from '../messaging/event/function-execution-completed-event';

export class FaasFunctionExecutionResult {
  private constructor(readonly result: string) {}

  static of(
    event: FunctionExecutionCompletedEvent,
  ): FaasFunctionExecutionResult {
    return new FaasFunctionExecutionResult(event.result);
  }
}
