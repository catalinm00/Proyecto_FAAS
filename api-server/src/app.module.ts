import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FunctionModule } from './function/function.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: `.env.${process.env.NODE_ENV || 'devel'}`,
    }),
    UserModule,

    FunctionModule,
    SharedModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            singleLine: true,
            colorize: true,
            timestamp: false,
            timestampKey: 'time',
            ignore: 'pid,hostname,context,req',
            messageFormat: '[{context}] {msg} {req.method} {req.url}',
            translateTime: 'dd/MM/yyyy HH:MM:ss.l',
          }
        },
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
