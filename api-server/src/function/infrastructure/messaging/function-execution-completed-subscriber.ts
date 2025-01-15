import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subscriber } from '../../domain/messaging/subscriber';
import { FunctionExecutionCompletedEvent } from '../../domain/messaging/event/function-execution-completed-event';
import { Observable, Subject } from 'rxjs';
import {
  AckPolicy,
  connect,
  JetStreamClient,
  JetStreamManager,
  NatsConnection,
  RetentionPolicy,
} from 'nats';
import { ConfigService } from '@nestjs/config';

const RESULT_STREAM: string = process.env.FUNCTION_EXECUTION_TOPIC_PREFIX;

@Injectable()
export class FunctionExecutionCompletedSubscriber
  implements Subscriber<FunctionExecutionCompletedEvent>, OnModuleInit
{
  private readonly logger: Logger = new Logger(
    'FunctionExecutionCompletedSubscriber',
  );
  private nc: NatsConnection = null;
  private jsm: JetStreamManager;
  private js: JetStreamClient;
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
    this.createStream();
  }

  private async connectWithRetry(retryCount = 0): Promise<void> {
    try {
      this.nc = await connect({ servers: [this.server] });
      this.jsm = await this.nc.jetstreamManager();
      this.js = this.nc.jetstream();
      this.logger.log('Successfully connected to NATS server');
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Failed to connect to NATS server. Retrying in ${
            this.retryDelay / 1000
          } seconds... (Attempt ${retryCount + 1}/${this.maxRetries})`,
        );
        await new Promise((resolve) => {
          setTimeout(resolve, this.retryDelay);
        });
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
    const fullTopic = this.topicPrefix + topic;
    this.createConsumer(fullTopic);
    const observable = new Subject<FunctionExecutionCompletedEvent>();
    this.js.consumers.get(fullTopic, {}).then((consumer) => {
      (async () => {
        const messages = await consumer.consume();
        for await (const msg of messages) {
          try {
            const decodedMessage = JSON.parse(msg.data.toString())['data'];
            observable.next(decodedMessage as FunctionExecutionCompletedEvent);
            msg.ack();
            await consumer.delete();
          } catch (error) {
            this.logger.error('Error processing message:', error);
            observable.error(error);
          }
        }
      })();
    });

    return observable;
  }

  private createConsumer(topic: string): void {
    this.jsm.consumers
      .add(topic, {
        name: `api-server-result-consumer-${topic}`,
        durable_name: `api-server-result-consumer-${topic}`,
        ack_policy: AckPolicy.Explicit,
      })
      .then((r) => {
        this.logger.log('Connected consumer: ' + r.name);
      })
      .catch((reason) => {
        this.logger.error('Could not create result consumer', reason);
      });
  }

  private createStream() {
    this.jsm.streams
      .add({
        subjects: [RESULT_STREAM + '*'],
        retention: RetentionPolicy.Workqueue,
        name: 'results',
      })
      .then((s) => {
        this.logger.log(
          'Stream created with config: ' + JSON.stringify(s.config),
        );
      })
      .catch((reason) => {
        this.logger.error('Could not create stream', reason);
      });
  }
}
