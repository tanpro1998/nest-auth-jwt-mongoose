import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { environments } from './environments/environments';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environments.mongoUrl, {
      autoIndex: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AuthModule, UserModule],
})
export class AppModule {}
