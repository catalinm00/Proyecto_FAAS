import { Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ConfigService } from '@nestjs/config';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

@Injectable()
export class FunctionExecutionRequestedPublisher
  implements Publisher<FunctionExecutionRequestedEvent>
{
  private readonly queue: string;
  private readonly sqsService: SQSClient;

  constructor(configService: ConfigService) {
    this.queue = configService.get('FUNCTION_DISPATCHING_QUEUE_URL');
    this.sqsService = new SQSClient({
      endpoint: configService.get('AWS_SQS_ENDPOINT'),
    });
  }

  async publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    const message: any = JSON.stringify(event);
    const msj = new SendMessageCommand({
      QueueUrl: this.queue,
      MessageBody: message,

    });
    await this.sqsService.send(msj);
  }
}
