import { Body, Controller, Logger, Post } from '@nestjs/common';
import { NatsService } from './service/NatsService';
import { FFunction } from './model/FFunction';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);
  private readonly nats: NatsService;

  constructor(nats: NatsService) {
    this.nats = nats;
  }

  @Post('send')
  async send(@Body('image') image: FFunction, @Body('queue') queue: string) {
    this.logger.log(`image: ${JSON.stringify(image)}, queue: ${queue}`);
    return await this.nats.sendMessage(queue, image);
  }
}
