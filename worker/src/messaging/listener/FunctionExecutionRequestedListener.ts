import { Controller, Logger } from "@nestjs/common";
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { FaasFunction } from "../../model/faas-function";
import { ExecuteFunctionService } from "../../service/execute-function-service";
import { FunctionExecutionCompletedEvent } from "../event/function-execution-completed-event";
import { FunctionExecutionRequestedEvent } from "../event/function-execution-requested-event";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
 
@Controller()
export class FunctionExecutionRequestedListener {
  private readonly logger: Logger = new Logger(
    "FunctionExecutionRequestedListener",
  );
  private readonly snsService: SNSClient;
  constructor(
    private readonly executeFunctionService: ExecuteFunctionService
  ) {
    this.snsService=new SNSClient({ region: process.env.AWS_REGION });
    


  }
 
  @SqsMessageHandler(process.env.FUNCTION_DISPATCHING_QUEUE, false)
  async handleMessage(message: any) {
    const event: FunctionExecutionRequestedEvent = JSON.parse(message.Body);
    this.logger.log(`Received: ${JSON.stringify(event)}`);
    const result = await this.executeFunctionService.execute(
      new FaasFunction(event.func.image),
    );
    const pattern = process.env.FUNCTION_EXECUTION_TOPIC_PREFIX + event.executionId;
    const command = new PublishCommand({
      Message: JSON.stringify(new FunctionExecutionCompletedEvent(result)),
      TopicArn: pattern,
    });
    await this.snsService.send(command);
  }
}