import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register(null)],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService, JwtModule, ConfigModule, UserModule],
})
export class AuthModule {}
