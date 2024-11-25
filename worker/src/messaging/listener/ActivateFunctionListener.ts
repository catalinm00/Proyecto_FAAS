import { Controller, Logger } from '@nestjs/common';
import { ActivateFunctionEvent } from '../event/ActivateFunctionEvent';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FFunction } from '../../model/FFunction';
import { ExecuteFunctionService } from '../../service/execute-function-service';

@Controller()
export class ActivateFunctionListener {
  private readonly logger: Logger = new Logger(ActivateFunctionEvent.name);
  constructor(
    private readonly executeFunctionService: ExecuteFunctionService,
  ) {}

  @MessagePattern('activate')
  listen(@Payload() event: ActivateFunctionEvent) {
    this.logger.log('Event received: ' + JSON.stringify(event));
    return this.executeFunctionService.execute(new FFunction(event.image));
  }
}
