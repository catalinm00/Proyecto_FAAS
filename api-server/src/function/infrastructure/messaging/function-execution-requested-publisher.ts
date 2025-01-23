import { Injectable } from '@nestjs/common';
import { Publisher } from '../../domain/messaging/publisher';
import { FunctionExecutionRequestedEvent } from '../../domain/messaging/event/function-execution-requested-event';
import { ConfigService } from '@nestjs/config';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Injectable()
export class FunctionExecutionRequestedPublisher
  implements Publisher<FunctionExecutionRequestedEvent>
{
  private readonly topic: string;
  constructor(
    private readonly client: NatsJetStreamClientProxy,
    configService: ConfigService,
  ) {
    this.topic = configService.get('FUNCTION_DISPATCHING_QUEUE');
  }

  async publish(event: FunctionExecutionRequestedEvent): Promise<void> {
    return this.client.emit(this.topic, event).toPromise();
  }
}
