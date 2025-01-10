import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FaasFunction } from '../model/faas-function';

@Injectable()
export class NatsService {
  // TODO: remove from final version, class for test purpose only
  private readonly _logger: Logger = new Logger('NatsService');
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {}

  async sendMessage(queue: string, message: FaasFunction): Promise<string> {
    return await this.client.emit(queue, message).toPromise();
  }
}
