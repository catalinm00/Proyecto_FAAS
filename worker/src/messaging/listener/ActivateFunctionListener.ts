import { Controller, Logger } from '@nestjs/common';
import { ActivateFunctionEvent } from '../event/ActivateFunctionEvent';
import { ExecuteFunctionService } from '../../service/ExecuteFunctionService';
import { FFunction } from '../../model/FFunction';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ActivateFunctionListener {
  private readonly logger: Logger = new Logger(ActivateFunctionEvent.name);
  constructor(
    private readonly executeFunctionService: ExecuteFunctionService,
  ) {}

  @EventPattern('activate-function') // TODO: Change to MessagePattern for synchronous communication when API Server is implemented
  async listen(@Payload() event: ActivateFunctionEvent): Promise<void> {
    this.logger.log('Event: ' + JSON.stringify(event));
    await this.executeFunctionService.execute(new FFunction(event.getImage()));
  }
}
