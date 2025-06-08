import { Body, Controller, Get, Post, Put, Req, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId; // JWT phải chứa userId
    return this.userService.findById(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateDto: UpdateUserDto) {
    const userId = req.user.userId;
    return this.userService.updateProfile(userId, updateDto);
  }
  
}
