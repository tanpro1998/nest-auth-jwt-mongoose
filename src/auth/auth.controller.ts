import { JwtAuthGuard } from './guard/jwt-auth.guard';
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(
      await this.authService.validate(body.username, body.password),
    );
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (await this.userService.getUserByName(body.username)) {
      throw new BadRequestException('User already exists');
    }

    if (await this.userService.getUserByEmail(body.email)) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.create(body);

    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.loginWithRefreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout-from-all-devices')
  async logoutFromAllDevices(@CurrentUser() user: User) {
    user.generateSessionToken();
    await user.save();
    return this.authService.login(user);
  }

  @Get('me')
  me(@CurrentUser() user: User) {
    return this.userService.filterUser(user, ['email']);
  }
}
