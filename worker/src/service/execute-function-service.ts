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
      await this.pullImageIfNecessary(func.image);
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
      this.cleanContainer(container);
    } catch (e) {
      logs = e.toString();
    } finally {
      const cleanedLogs = this.cleanDockerLogs(logs);
      this.logger.log(`Function result: ${cleanedLogs}`);
      return cleanedLogs;
    }
  }

  private async pullImageIfNecessary(imageName: string): Promise<void> {
    try {
      const images = await this.containerRuntime.image.list();

      // Check if image exists locally
      const imageExists = images.some(image => {
        const repoTags = image.data['RepoTags'];
        if (!repoTags) return false;
        // Check if image name matches any tag
        return repoTags.some(tag => {
          // Handle 'latest' tag if no tag specified
          const searchName = imageName.includes(':') ? imageName : `${imageName}:latest`;
          return tag === searchName;
        });
      });

      if (imageExists) {
        this.logger.log(`Image ${imageName} already exists locally`);
        return;
      }

      this.logger.log(`Pulling image ${imageName}...`);
      await this.containerRuntime.image.create({}, { fromImage: imageName });
      this.logger.log(`Successfully pulled image ${imageName}`);
    } catch (error) {
      this.logger.error(`Failed to check/pull image ${imageName}: ${error.message}`);
      throw new Error(`Failed to ensure image availability: ${error.message}`);
    }
  }

  private cleanDockerLogs(logs: string): string {
    if (!logs) return '';

    return logs
      .split('\n')
      .map(line => {
        const cleaned = line.replace(/\u0001\u0000\u0000\u0000\u0000\u0000\u0000./g, '')
          .replace(/[\u0000-\u0008\u000B-\u001F]/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\[nr]/g, '\n');

        return cleaned;
      })
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  private async cleanContainer(container: Container) {
    await container.stop();
    await container.delete();
    this.logger.log(`Container ${container.id} removed`)
  }
}
