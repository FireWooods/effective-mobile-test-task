import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Создание 1 миллиона пользователей' })
  @ApiResponse({ status: 200, type: User })
  @Post('')
  createFakeUser() {
    return this.userService.createFakeUser();
  }

  @ApiOperation({ summary: 'Обновить пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('')
  updateUser() {
    return this.userService.updateUsers();
  }
}
