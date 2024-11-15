import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FFunction } from '../model/FFunction';

@Injectable()
export class NatsService {
  private readonly _logger: Logger = new Logger('NatsService');
  constructor(@Inject('NATS_CLIENT') private readonly client: ClientProxy) {}

  sendMessage(queue: string, message: FFunction) {
    this.client.emit(queue, message).subscribe({
      next: (next) => {
        this._logger.log(next);
      },
    });
  }
}
