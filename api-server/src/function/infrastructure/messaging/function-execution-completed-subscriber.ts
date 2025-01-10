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
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 segundos

  constructor(configService: ConfigService) {
    this.topicPrefix = configService.get('FUNCTION_EXECUTION_TOPIC_PREFIX');
    this.server = configService.get('NATS_SERVER');
  }

  async onModuleInit(): Promise<any> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(retryCount = 0): Promise<void> {
    try {
      this.nc = await connect({ servers: [this.server] });
      this.logger.log('Successfully connected to NATS server');
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Failed to connect to NATS server. Retrying in ${
            this.retryDelay / 1000
          } seconds... (Attempt ${retryCount + 1}/${this.maxRetries})`,
        );
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        this.logger.error(
          `Failed to connect to NATS server after ${this.maxRetries} attempts`,
        );
        throw error;
      }
    }
  }

  subscribe(topic: string): Observable<FunctionExecutionCompletedEvent> {
    if (!this.nc || this.nc.isClosed()) {
      throw new Error('NATS connection not established');
    }

    let observable = new Subject<FunctionExecutionCompletedEvent>();
    let subscription = this.nc.subscribe(this.topicPrefix + topic);

    (async () => {
      for await (const msg of subscription) {
        try {
          const decodedMessage = JSON.parse(msg.data.toString())['data'];
          observable.next(decodedMessage as FunctionExecutionCompletedEvent);
          subscription.unsubscribe();
        } catch (error) {
          this.logger.error('Error processing message:', error);
          observable.error(error);
        }
      }
    })();

    return observable;
  }
}