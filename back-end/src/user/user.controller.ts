import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Request,
<<<<<<< Updated upstream
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

=======
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
>>>>>>> Stashed changes


@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

<<<<<<< Updated upstream

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
  

=======
>>>>>>> Stashed changes
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update')
  async updateMyProfile(
    @Request() req,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }
<<<<<<< Updated upstream

  

=======
>>>>>>> Stashed changes
}
