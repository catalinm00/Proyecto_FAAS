import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subscriber } from '../../domain/messaging/subscriber';
import { FunctionExecutionCompletedEvent } from '../../domain/messaging/event/function-execution-completed-event';
import { Observable, Subject } from 'rxjs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { ConfigService } from '@nestjs/config';
 
@Injectable()
export class FunctionExecutionCompletedSubscriber
  implements Subscriber<FunctionExecutionCompletedEvent>, OnModuleInit {
  private readonly logger: Logger = new Logger(
    FunctionExecutionCompletedSubscriber.name,
  );
  private readonly TOPIC_PREFIX: string;
  private readonly server: string;
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000;
 
  constructor(configService: ConfigService) {
    this.TOPIC_PREFIX = configService.get('FUNCTION_EXECUTION_TOPIC_PREFIX');
    this.server = configService.get('AWS_SQS_ENDPOINT');
  }
 
  async onModuleInit(): Promise<any> {
    // No need to connect explicitly with SQS
  }
 
  @SqsMessageHandler(process.env.FUNCTION_DISPATCHING_QUEUE, false)
  async handleMessage(message: any) {
    const observable = new Subject<FunctionExecutionCompletedEvent>();
    const decodedMessage = JSON.parse(message.Body);
    observable.next(decodedMessage as FunctionExecutionCompletedEvent);
    return observable;
  }
 
  subscribe(topic: string): Observable<FunctionExecutionCompletedEvent> {
    const observable = new Subject<FunctionExecutionCompletedEvent>();
    return observable;
  }
}