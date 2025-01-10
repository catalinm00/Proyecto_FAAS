import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { FaasFunction } from '../../model/faas-function';
import { ExecuteFunctionService } from '../../service/execute-function-service';
import { FunctionExecutionCompletedEvent } from '../event/function-execution-completed-event';
import { FunctionExecutionRequestedEvent } from '../event/function-execution-requested-event';

const FUNCTIONS_QUEUE = 'functions';
const EXECUTIONS_QUEUE = 'execution/';

@Controller()
export class FunctionExecutionRequestedListener {
  private readonly logger: Logger = new Logger('FunctionExecutionRequestedListener');

  constructor(
    private readonly executeFunctionService: ExecuteFunctionService,
    @Inject('NATS_CLIENT') private readonly client: ClientProxy,
  ) {
  }

  @EventPattern(FUNCTIONS_QUEUE)
  async listen(@Payload() event: FunctionExecutionRequestedEvent) {
    this.logger.log(`Received: ${JSON.stringify(event)}`);
    let result = await this.executeFunctionService.execute(new FaasFunction(event.func.image));
    let pattern = EXECUTIONS_QUEUE + event.executionId;
    this.client.emit(pattern, new FunctionExecutionCompletedEvent(result));
  }
}
