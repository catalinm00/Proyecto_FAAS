import { Inject, Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ClientProxy } from '@nestjs/microservices';
import process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FunctionExecutionRequestedPublisher implements Publisher<FunctionExecutionRequestedEvent> {
  private readonly topic: string;
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy, configService: ConfigService) {
    this.topic = configService.get('FUNCTION_DISPATCHING_QUEUE');
  }

  async publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    return this.client.emit(this.topic, event).toPromise()
  }
}