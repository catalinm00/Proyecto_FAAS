import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsService } from './service/NatsService';
import { FFunction } from './model/FFunction';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);
  private readonly nats: NatsService;
  private readonly appService: AppService;

  constructor(appService: AppService, nats: NatsService) {
    this.appService = appService;
    this.nats = nats;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send')
  send(@Body('image') image: FFunction, @Body('queue') queue: string) {
    this.logger.log(`image: ${JSON.stringify(image)}, queue: ${queue}`);
    this.nats.sendMessage(queue, image);
  }
}
