import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send/:toUserId')
  async sendFriendRequest(@Req() req, @Param('toUserId') toUserId: string) {
    const fromUserId = req.user.userId;
    return this.friendRequestService.sendFriendRequest(fromUserId, toUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept/:requestId')
  async acceptFriendRequest(@Req() req, @Param('requestId') requestId: string) {
    return this.friendRequestService.acceptFriendRequest(requestId);
  }

  @UseGuards(JwtAuthGuard)
    @Post('reject/:requestId')
    async rejectFriendRequest(@Req() req, @Param('requestId') requestId: string) {
    return this.friendRequestService.rejectFriendRequest(requestId);
    }

}
