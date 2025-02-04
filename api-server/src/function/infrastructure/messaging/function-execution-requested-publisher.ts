import { Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ConfigService } from '@nestjs/config';
import { SqsService } from '@ssut/nestjs-sqs';
 
@Injectable()
export class FunctionExecutionRequestedPublisher
  implements Publisher<FunctionExecutionRequestedEvent>
{
  private readonly topic: string;
  constructor(
    private readonly sqsService: SqsService,
    configService: ConfigService,
  ) {
    this.topic = configService.get('FUNCTION_DISPATCHING_QUEUE');
  }
 
  async publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    const message: any = JSON.stringify(event);
    this.sqsService.send(this.topic, message);
  }
}