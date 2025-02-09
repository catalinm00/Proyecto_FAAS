import { Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ConfigService } from '@nestjs/config';
import { SqsService } from '@ssut/nestjs-sqs';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Endpoint } from 'aws-sdk';

@Injectable()
export class FunctionExecutionRequestedPublisher
  implements Publisher<FunctionExecutionRequestedEvent>
{
  private readonly topic: string;
  private readonly sqsService: SQSClient
  constructor(
    configService: ConfigService,
  ) {
    this.topic = configService.get('FUNCTION_DISPATCHING_QUEUE');
    this.sqsService= new SQSClient({
      endpoint:"http://localstack:4566"
    })
  }
 
  async publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    const message: any = JSON.stringify(event);
    const msj = new SendMessageCommand({ QueueUrl: this.topic, MessageBody: message });
    this.sqsService.send(msj);
  }
}