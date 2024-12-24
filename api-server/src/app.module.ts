import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { FunctionModule } from './function/function.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { CreateUser } from './user/application/use-case/create-user';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env.devel' }),
    AuthenticationModule,
    UserModule,
    FunctionModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
