import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { FaasFunction } from "../../model/faas-function";
import { ExecuteFunctionService } from "../../service/execute-function-service";
import { FunctionExecutionCompletedEvent } from "../event/function-execution-completed-event";
import { FunctionExecutionRequestedEvent } from "../event/function-execution-requested-event";
import { NatsJetStreamClientProxy } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

const FUNCTIONS_QUEUE = process.env.FUNCTION_DISPATCHING_QUEUE || "functions";
const EXECUTIONS_RESULTS_QUEUE = process.env.NATS_FUNCTION_RESPONSE_QUEUE || "execution.";

@Controller()
export class FunctionExecutionRequestedListener {
  private readonly logger: Logger = new Logger(
    "FunctionExecutionRequestedListener",
  );

  constructor(
    private readonly executeFunctionService: ExecuteFunctionService,
    private readonly client: NatsJetStreamClientProxy,
  ) {}

  @EventPattern(FUNCTIONS_QUEUE)
  async listen(@Payload() event: FunctionExecutionRequestedEvent) {
    this.logger.log(`Received: ${JSON.stringify(event)}`);
    const result = await this.executeFunctionService.execute(
      new FaasFunction(event.func.image),
    );
    const pattern = EXECUTIONS_RESULTS_QUEUE + event.executionId;
    this.client.emit(pattern, new FunctionExecutionCompletedEvent(result));
  }
}
