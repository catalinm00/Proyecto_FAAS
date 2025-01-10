import { Event } from '../event';
import { FaasFunction } from '../../model/faasfunction';
import { FaasFunctionExecution } from '../../model/faasfunction-execution';

export class FunctionExecutionRequestedEvent implements Event {
  private constructor(readonly executionId: string, readonly func: _FaasFunction) {}

  static of(execution: FaasFunctionExecution, func: FaasFunction): FunctionExecutionRequestedEvent {
    let _func = _FaasFunction.of(func)
    return new FunctionExecutionRequestedEvent(execution.id, _func);
  }
}
class _FaasFunction {
  constructor(public readonly image: string) {}
  static of(func: FaasFunction): _FaasFunction {
    return new _FaasFunction(func.image)
  }
}