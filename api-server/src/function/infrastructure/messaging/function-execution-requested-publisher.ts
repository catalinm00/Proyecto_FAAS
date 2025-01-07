import { Inject, Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ClientProxy } from '@nestjs/microservices';
import process from 'node:process';

@Injectable()
export class FunctionExecutionRequestedPublisher implements Publisher<FunctionExecutionRequestedEvent> {
  private readonly topic = process.env.FUNCTION_DISPATCHING_QUEUE || 'functions';
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {
  }

  publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    return this.client.send(this.topic, event).toPromise();
  }
}