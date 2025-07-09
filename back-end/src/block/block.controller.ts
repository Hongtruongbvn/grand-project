import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BlockService } from './block.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:userId')
  async blockUser(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = req.user.userId;
    return this.blockService.blockUser(currentUserId, userId);
  }
}
