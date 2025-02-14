import { Controller, Get, Delete, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete()
  async deleteUser(@Body('telegramId') telegramId: string) {
    return this.usersService.deleteUser(telegramId);
  }

  @Patch()
  async updateUser(@Body('telegramId') telegramId: string, @Body('isBlocked') isBlocked: boolean) {
    return this.usersService.updateUserBlockStatus(telegramId, isBlocked);
  }
}
