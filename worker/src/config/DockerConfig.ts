import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Dockerode from 'dockerode-ts';

export const DockerConfig: Provider = {
  inject: [ConfigService],
  provide: 'DOCKER_INSTANCE',
  name: 'DOCKER_INSTANCE',
  useFactory: (configService: ConfigService) => {
    return new Dockerode({
      socketPath: configService.get(
        'DOCKER_DAEMON_HOST',
        '/var/run/docker.sock',
      ),
    });
  },
};
