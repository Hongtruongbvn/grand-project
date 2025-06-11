import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Request,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    console.log('REQ.USER:', req.user);
    return this.userService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update')
  async updateMyProfile(@Request() req, @Body() updateDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }
  @Post('set/role/user')
  @UseGuards(AuthGuard('jwt'))
  async setUserRole(@Request() req) {
    return this.userService.setDefaultRole(req.user.userId);
  }
}
