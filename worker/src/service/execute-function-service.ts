import { Docker } from 'node-docker-api';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FFunction } from '../model/FFunction';
import { Stream } from 'stream';

@Injectable()
export class ExecuteFunctionService {
  private readonly logger: Logger = new Logger(ExecuteFunctionService.name);

  constructor(@Inject('DOCKER_CLIENT') private readonly containerRuntime: Docker) {
  }


  async execute(func: FFunction) {
    this.pullImageIfNecessary(func.getImage());
    let container = await this.containerRuntime.container.create({
      Image: func.getImage(),
      AttachStdout: true,
      AttachStdErr: true,
    })

    await container.start();
    let logs: string = '';
    const logStream: Stream = await container.logs({
      follow: false,
      stdout: true,
      stderr: true,
    }) as Stream;
    logStream.on('data', (d) => logs+=d.toString());

    await new Promise((resolve, reject) => {
      logStream.on('end', resolve);
      logStream.on('error', reject);
    });

    this.logger.log('Container logs: ' + logs);
    return logs;

    /* let _container;
     let logs: string = '';
     this.containerRuntime.container.create({
       Image: func.getImage(),
       name: 'test',
       AttachStdout: true,
     })
       .then(container => {
         return container.start();
       })
       .then(container => container.stop())
       .then(container => container.delete())
       .catch(error => this.logger.log(error));
     return logs;*/

  }

  pullImageIfNecessary(image: string) {
    let imageNameParts = image.split(':');
    let tag = imageNameParts.length > 1 ? imageNameParts[1] : 'latest';
    this.containerRuntime.image.list({})
      .then(images => images
        .find(image => image.data['RepoTags']
          .find(tag => tag.includes(image)),
        ),
      )
      .then(() => this.logger.log('Image already exist, pull is not needed'))
      .catch(() =>
        this.containerRuntime.image.create({}, { fromImage: image, tag: tag })
          .then(stream => this.promisifyStream(stream as Stream)),
      );
  }

  private promisifyStream(stream: Stream) {
    return new Promise((resolve, reject) => {
      stream.on('data', (d) => this.logger.log(d.toString()));
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }

  private getContainerLogs(container, logs: string) {
    return new Promise((resolve, reject) => {
      container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      })
        .then(stream => {
          stream.on('data', (d) => logs += d.toString()),
            stream.on('error', err => logs += err.toString()),
            stream.on('end', resolve);
        });
    });
  }

}