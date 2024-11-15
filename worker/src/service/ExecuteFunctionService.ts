import { Inject, Injectable } from '@nestjs/common';
import Dockerode, { Container } from 'dockerode-ts';
import { FFunction } from '../model/FFunction';

@Injectable()
export class ExecuteFunctionService {
  constructor(
    @Inject('DOCKER_INSTANCE') private readonly containerRuntime: Dockerode,
  ) {}

  async execute(func: FFunction): Promise<string> {
    return await this.runContainer(func.getImage().valueOf());
  }

  async runContainer(imageName: string) {
    try {
      await this.pullImage(imageName);
      const container = await this.createContainer(imageName);
      await this.startContainer(container);
      const logs = await this.getContainerLogs(container);
      await this.removeContainer(container);
      return logs;
    } catch (err) {
      throw new Error(`Error al ejecutar el contenedor: ${err.message}`);
    }
  }

  pullImage(imageName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.containerRuntime.pull(imageName, {}, (err, stream) => {
        if (err) {
          return reject(err);
        }
        this.containerRuntime.modem.followProgress(
          stream,
          () => resolve(),
          reject,
        );
      });
    });
  }

  createContainer(imageName: string): Promise<Container> {
    return new Promise((resolve, reject) => {
      this.containerRuntime.createContainer(
        {
          Image: imageName, name: 'temp-container',
          Tty: true,
          AttachStderr: true,
          AttachStdin: true,
          AttachStdout: true
        },
        (err, container) => {
          if (err) {
            return reject(err);
          }
          resolve(container);
        },
      );
    });
  }

  startContainer(container: Container): Promise<void> {
    return new Promise((resolve, reject) => {
      container.start((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  getContainerLogs(container: Container): Promise<string> {
    return new Promise((resolve, reject) => {
      container.logs(
        { follow: true, stdout: true, stderr: true },
        (err, stream) => {
          if (err) {
            return reject(err);
          }
          let logs = '';
          stream.on('data', (chunk) => {
            logs += chunk.toString();
          });
          stream.on('end', () => {
            resolve(logs);
          });
        },
      );
    });
  }

  removeContainer(container: Container): Promise<void> {
    return new Promise((resolve, reject) => {
      container.remove((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
