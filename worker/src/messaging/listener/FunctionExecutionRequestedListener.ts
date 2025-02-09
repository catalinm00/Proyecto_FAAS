import { Injectable, Logger } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { FaasFunction } from "../../model/faas-function";
import { ExecuteFunctionService } from "../../service/execute-function-service";
import { FunctionExecutionCompletedEvent } from "../event/function-execution-completed-event";
import { FunctionExecutionRequestedEvent } from "../event/function-execution-requested-event";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

@Injectable()
export class FunctionExecutionRequestedListener {
  private readonly logger: Logger = new Logger(
    "FunctionExecutionRequestedListener",
  );
  private readonly snsService: SNSClient;
  private readonly sqsService: SQSClient;

  constructor(private readonly executeFunctionService: ExecuteFunctionService) {
    this.sqsService = new SQSClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_SQS_ENDPOINT,
    });
    this.snsService = new SNSClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_SQS_ENDPOINT,
    });
  }

  @SqsMessageHandler(process.env.FUNCTION_DISPATCHING_QUEUE, false)
  async handleMessage(message: any) {
    this.logger.log(`Received: ${JSON.stringify(message)}`);
    const event: FunctionExecutionRequestedEvent = JSON.parse(message.Body);
    //this.logger.log(`Received: ${JSON.stringify(event)}`);
    const result = await this.executeFunctionService.execute(
      new FaasFunction(event.func.image),
    );
    const pattern =
      process.env.FUNCTION_EXECUTION_TOPIC_PREFIX + event.executionId;
    const command = new PublishCommand({
      Message: JSON.stringify(new FunctionExecutionCompletedEvent(result)),
      TopicArn: pattern,
    });
    await this.snsService.send(command);
    try {
      // Delete the message from the queue after processing
      await this.sqsService.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.FUNCTION_DISPATCHING_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle,
        }),
      );
      this.logger.log("Message deleted successfully");
    } catch (error) {
      this.logger.error("Failed to delete message", error);
    }
  }
}
