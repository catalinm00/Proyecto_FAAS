import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Subscriber } from '../../domain/messaging/subscriber';
import { FunctionExecutionCompletedEvent } from '../../domain/messaging/event/function-execution-completed-event';
import { Observable, Subject } from 'rxjs';
import { AckPolicy, connect, JetStreamClient, JetStreamManager, NatsConnection, RetentionPolicy } from 'nats';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FunctionExecutionCompletedSubscriber
  implements Subscriber<FunctionExecutionCompletedEvent>, OnModuleInit {
  private readonly logger: Logger = new Logger(
    FunctionExecutionCompletedSubscriber.name,
  );
  private readonly TOPIC_PREFIX: string;
  private readonly RESULT_STREAM = 'results';
  private readonly server: string;
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000;
  private nc: NatsConnection = null;
  private jsm: JetStreamManager;
  private js: JetStreamClient;

  constructor(configService: ConfigService) {
    this.TOPIC_PREFIX = configService.get('FUNCTION_EXECUTION_TOPIC_PREFIX');
    this.server = configService.get('NATS_SERVER');
  }

  async onModuleInit(): Promise<any> {
    await this.connectWithRetry();
    await this.createStream();
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
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
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
    const fullTopic = `${this.TOPIC_PREFIX}${topic}`;
    this.createConsumer(topic, fullTopic);
    const observable = new Subject<FunctionExecutionCompletedEvent>();

    this.js.consumers.get(this.RESULT_STREAM, `api-server-result-consumer-${topic}`).then((consumer) => {
      (async () => {
        const msgs = await consumer.consume();
        for await (const msg of msgs) {
          this.logger.log("Received: "+msg.toString());
          const decodedMessage = JSON.parse(msg.data.toString());
          observable.next(decodedMessage as FunctionExecutionCompletedEvent);
          msg.ack();
          await consumer.delete();
        }
      })();
    });

    return observable;
  }

  private async createConsumer(id: string, topic: string) {
    try {
      await this.jsm.consumers.add(this.RESULT_STREAM, {
        name: `api-server-result-consumer-${id}`,
        durable_name: `api-server-result-consumer-${id}`,
        ack_policy: AckPolicy.Explicit,
        filter_subject: topic,
      });
    } catch (error) {
      this.logger.error('Could not create result consumer', error);
    }
  }

  private async createStream(): Promise<void> {
    try {
      const stream = await this.jsm.streams.info(this.RESULT_STREAM).catch(() => null);
      if (stream) {
        this.logger.log('Stream already exists');
        return;
      }

      const newStream = await this.jsm.streams.add({
        name: this.RESULT_STREAM,
        subjects: [`${this.TOPIC_PREFIX}*`],
        retention: RetentionPolicy.Workqueue,
      });

      this.logger.log(`Stream created:  ${newStream.config.name}`);
    } catch (error) {
      this.logger.error('Error creating stream:', error);
      throw error;
    }
  }
}