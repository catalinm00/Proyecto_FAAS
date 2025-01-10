import { Docker } from 'node-docker-api';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FaasFunction } from '../model/faas-function';
import { Stream } from 'stream';
import { Container } from 'node-docker-api/lib/container';

@Injectable()
export class ExecuteFunctionService {
  private readonly logger: Logger = new Logger(ExecuteFunctionService.name);

  constructor(
    @Inject('DOCKER_CLIENT') private readonly containerRuntime: Docker,
  ) {
  }

  private readonly logOpts = {
    follow: false,
    stdout: true,
    stderr: true,
    timestamps: false,
  };

  async execute(func: FaasFunction) {
    this.logger.log(`Execute function ${func}`);
    let logs: string = '';
    try {
      this.pullImageIfNecessary(func.image);
      let container: Container = await this.containerRuntime.container.create({
        Image: func.image,
        AttachStdout: true,
        AttachStdErr: true,
      });
      await container.start();
      const logStream: Stream = (await container.logs(this.logOpts)) as Stream;
      logStream.on('data', (d) => (logs += d.toString()));

      await new Promise((resolve, reject) => {
        logStream.on('end', resolve);
        logStream.on('error', reject);
      });
      //TODO: usar un evento de dominio de función ejecutada para parar y eliminar el contenedor
      // con tal de obtener un mejor tiempo de respuesta
      this.cleanContainer(container);
    } catch (e) {
      logs = e.toString();
    } finally {
      this.logger.log(`Function result: ${logs}`);
      return logs;
    }
  }

  private pullImageIfNecessary(image: string) {
    this.containerRuntime.image
      .list({})
      .then((images) =>
        images.find((image) =>
          image.data['RepoTags'].find((tag) => tag.includes(image)),
        ),
      )
      .then((ls) =>
        this.logger.log('Image already exist, pull is not needed'))
      .catch(() =>
        this.containerRuntime.image
          .create({}, { fromImage: image})
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

  private async cleanContainer(container: Container) {
    await container.stop();
    await container.delete();
    this.logger.log(`Container ${container.id} removed`)
  }
}
