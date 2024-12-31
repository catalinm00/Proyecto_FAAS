import { Docker } from 'node-docker-api';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FFunction } from '../model/FFunction';
import { Stream } from 'stream';

@Injectable()
export class ExecuteFunctionService {
  private readonly logger: Logger = new Logger(ExecuteFunctionService.name);

  constructor(
    @Inject('DOCKER_CLIENT') private readonly containerRuntime: Docker,
  ) {}

  async execute(func: FFunction) {
    this.pullImageIfNecessary(func.getImage());
    let container = await this.containerRuntime.container.create({
      Image: func.getImage(),
      AttachStdout: true,
      AttachStdErr: true,
    });

    await container.start();
    let logs: string = '';
    const logStream: Stream = (await container.logs({
      follow: false,
      stdout: true,
      stderr: true,
      timestamps: true,
    })) as Stream;
    logStream.on('data', (d) => (logs += d.toString()));

    await new Promise((resolve, reject) => {
      logStream.on('end', resolve);
      logStream.on('error', reject);
    });
    this.logger.log('Container logs: ' + logs);
    //TODO: usar un evento de dominio de función ejecutada para parar y eliminar el contenedor
    // con tal de obtener un mejor tiempo de respuesta
    await container.stop();
    await container.delete();
    return logs;
  }

  private pullImageIfNecessary(image: string) {
    let imageNameParts = image.split(':');
    let tag = imageNameParts.length > 1 ? imageNameParts[1] : 'latest';
    this.containerRuntime.image
      .list({})
      .then((images) =>
        images.find((image) =>
          image.data['RepoTags'].find((tag) => tag.includes(image)),
        ),
      )
      .then(() => this.logger.log('Image already exist, pull is not needed'))
      .catch(() =>
        this.containerRuntime.image
          .create({}, { fromImage: image, tag: tag })
          .then((stream) => this.promisifyStream(stream as Stream)),
      );
  }

  private promisifyStream(stream: Stream) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d) => this.logger.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
