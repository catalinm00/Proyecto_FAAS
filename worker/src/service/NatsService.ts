import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FFunction } from '../model/FFunction';

@Injectable()
export class NatsService {
  // TODO: remove from final version, class for test purpose only
  private readonly _logger: Logger = new Logger('NatsService');
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {}

  async sendMessage(queue: string, message: FFunction): Promise<string> {
    return await this.client.send(queue, message).toPromise();
  }
}
