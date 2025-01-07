import { Injectable } from '@nestjs/common';
import { Subscriber } from '../../domain/messaging/subscriber';
import { FunctionExecutionCompletedEvent } from '../../domain/messaging/event/function-execution-completed-event';
import { Observable, Subject } from 'rxjs';
import { connect, JSONCodec, NatsConnection } from 'nats';
import process from 'node:process';

@Injectable()
export class FunctionExecutionCompletedSubscriber implements Subscriber<FunctionExecutionCompletedEvent>{
  private readonly nc: NatsConnection = null;
  private readonly topicPrefix = process.env.FUNCTION_EXECUTION_TOPIC_PREFIX;
  private readonly codec = JSONCodec<FunctionExecutionCompletedEvent>();

  constructor() {}

  subscribe(topic: string): Observable<FunctionExecutionCompletedEvent> {
    if(this.nc == null) {
      connect({servers: [process.env.NATS_SERVER]}).then(
        () => console.log("NATS connected")
      );
    }
    let observable = new Subject<FunctionExecutionCompletedEvent>();
    let subscription = this.nc.subscribe(this.topicPrefix + topic);
    (async () => { for await (const msg of subscription) {
      const decodedMessage = this.codec.decode(msg.data);
      observable.next(decodedMessage);
      subscription.unsubscribe();
    }})();
    return observable;
  }

}
