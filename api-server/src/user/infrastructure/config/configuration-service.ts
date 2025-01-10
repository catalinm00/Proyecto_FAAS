import { ConfigService } from '@nestjs/config';

export class ConfigurationService {
  constructor(configService: ConfigService) {}
}

export interface MessagingConfig {
  NATS_SERVER: string;
  FUNCTION_EXECUTION_TOPIC_PREFIX: string;
  FUNCTION_DISPATCHING_QUEUE: string;
}

export interface SecurityConfig {
  SALTING_WORD: string;
  APISIX_ADMIN_KEY: string;
  APISIX_URL: string;
}

export interface DbConfig {
  DATABASE_URL: string;
}
