import { Docker } from 'node-docker-api';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FaasFunction } from '../model/faas-function';
import { Stream } from 'stream';
import { Container } from 'node-docker-api/lib/container';

@Injectable()
export class ExecuteFunctionService {
  private readonly logger: Logger = new Logger(ExecuteFunctionService.name);
  private readonly TIME_LIMIT_ms = 15000;

  constructor(
    @Inject('DOCKER_CLIENT') private readonly containerRuntime: Docker,
  ) {
  }

  private readonly logOpts = {
    follow: true,
    stdout: true,
    stderr: true,
    timestamps: false,
  };

  async execute(func: FaasFunction): Promise<string> {
    if (!func || !func.image) {
      throw new Error('Invalid function details provided');
    }

    this.logger.log(`Executing function with image: ${func.image}`);
    let logs = '';
    let container: Container;
    try {
      const imgId = await this.pullImageIfNecessary(func.image);
      this.logger.log(`Using image with ID: ${imgId}`);

      container = await this.containerRuntime.container.create({
        Image: imgId,
        AttachStdout: true,
        AttachStderr: true,
      });

      await container.start();
      const logStream: Stream = (await container.logs(this.logOpts)) as Stream;

      logStream.on('data', (chunk) => {
        logs += chunk.toString();
      });

      await new Promise((resolve, reject) => {
        logStream.on('end', resolve);
        logStream.on('error', reject);
        setTimeout(() => {
          reject(Error('Function execution time surpassed the established limit. ABORTED'));
        }, this.TIME_LIMIT_ms);
      });

      await this.cleanContainer(container);
    } catch (error) {
      this.cleanContainer(container);
      this.logger.error(`Error executing function: ${error.message}`);
      logs += '\n\n' + error.message;
    } finally {
      const cleanedLogs = this.cleanDockerLogs(logs);
      this.logger.log(`Execution result: ${cleanedLogs}`);
      return cleanedLogs;
    }
  }

  private async pullImageIfNecessary(imageName: string): Promise<string> {
    try {
      const existingImageId = await this.lookForImage(imageName);

      if (existingImageId) {
        this.logger.log(`Image already exists: ${imageName}`);
        return existingImageId;
      }

      this.logger.log(`Pulling image: ${imageName}`);
      await this.containerRuntime.image.create({}, { fromImage: imageName.includes(':') ? imageName : `${imageName}:latest` });
      this.logger.log(`Image pulled successfully: ${imageName}`);
      for(let i = 0; i < 3; i++) {
        let imgId = await this.lookForImage(imageName);
        if(imgId == null) {
          await this.sleep((i+1)*1000);
        } else return imgId;
      }
      return (await this.lookForImage(imageName)) || '';
    } catch (error) {
      this.logger.error(`Failed to pull image ${imageName}: ${error.message}`);
      throw new Error(`Error pulling image ${imageName}: ${error.message}`);
    }
  }

  private async lookForImage(imageName: string): Promise<string | null> {
    try {
      const images = await this.containerRuntime.image.list();

      for (const image of images) {
        if (image.id === imageName) {
          return image.id;
        }
        const repoTags = image.data['RepoTags'] || [];
        const searchName = imageName.includes(':') ? imageName : `${imageName}:latest`;

        if (repoTags.includes(searchName) || repoTags.includes(imageName)) {
          return image.id;
        }
      }

      return null;
    } catch (error) {
      this.logger.error(`Error checking for image: ${error.message}`);
      throw new Error(`Error checking for image: ${error.message}`);
    }
  }
  async sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  private cleanDockerLogs(logs: string): string {
    return logs
      .split('\n')
      .map((line) =>
        line
          .replace(/\u0001\u0000\u0000\u0000\u0000\u0000\u0000./g, '')
          .replace(/[\u0000-\u0008\u000B-\u001F]/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\[nr]/g, '\n'),
      )
      .filter((line) => line.trim().length > 0)
      .join('\n');
  }

  private async cleanContainer(container: Container): Promise<void> {
    try {
      await container.stop();
      await container.delete();
      this.logger.log(`Container ${container.id} removed successfully`);
    } catch (error) {
      this.logger.error(`Error cleaning up container ${container.id}: ${error.message}`);
    }
  }
}
