import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { Block } from './schema/block.schema';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private readonly blockModel: Model<Block>,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}
  async blockUser(userId: string, targetId: string) {
    const block = await this.blockModel.create({
      user_id: new Types.ObjectId(userId),
      blocked_id: new Types.ObjectId(targetId),
    });
    const targetUser = await this.userService.findById(targetId);
    await this.notificationService.createNoTi(
      `Bạn đã bị chặn bởi người dùng ${targetUser.username}`,
      targetId,
      userId,
    );
  }
}
