import { Provider } from '@nestjs/common';
import { Docker } from 'node-docker-api';
import * as process from 'node:process';

export const DockerClient: Provider = {
  provide: 'DOCKER_CLIENT',
  useFactory: () => {
    return new Docker({
      socketPath: process.env.DOCKER_DAEMON_HOST
    })
  }
}