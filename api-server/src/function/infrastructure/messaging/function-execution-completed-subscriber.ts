import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subscriber } from '../../domain/messaging/subscriber';
import { FunctionExecutionCompletedEvent } from '../../domain/messaging/event/function-execution-completed-event';
import { Observable, Subject } from 'rxjs';
import { connect, JSONCodec, NatsConnection } from 'nats';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';
import { NatsMsg } from '@nestjs/microservices/external/nats-client.interface';

@Injectable()
export class FunctionExecutionCompletedSubscriber
  implements Subscriber<FunctionExecutionCompletedEvent>, OnModuleInit
{
  private readonly logger: Logger = new Logger(
    'FunctionExecutionCompletedSubscriber',
  );
  private nc: NatsConnection = null;
  private readonly topicPrefix: string;
  private readonly server: string;
  private readonly codec = JSONCodec<NatsMsg>();

  constructor(configService: ConfigService) {
    this.topicPrefix = configService.get('FUNCTION_EXECUTION_TOPIC_PREFIX');
    this.server = configService.get('NATS_SERVER');
  }

  async onModuleInit(): Promise<any> {
    this.nc = await connect({ servers: [this.server] });
  }

  subscribe(topic: string): Observable<FunctionExecutionCompletedEvent> {
    let observable = new Subject<FunctionExecutionCompletedEvent>();
    let subscription = this.nc.subscribe(this.topicPrefix + topic);
    (async () => {
      for await (const msg of subscription) {
        const decodedMessage = JSON.parse(msg.data.toString())['data'];
        observable.next(decodedMessage as FunctionExecutionCompletedEvent);
        subscription.unsubscribe();
      }
    })();
    return observable;
  }
}
