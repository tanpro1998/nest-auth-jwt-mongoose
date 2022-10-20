import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.userService.filterUser(
      await this.userService.validateUserByName(username),
    );
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
