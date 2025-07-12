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
  async blockList(userId: string) {
    const blocked = await this.blockModel.find({ user_id: userId });
    return blocked;
  }
  async isInBlockList(userId: string, senderId: string): Promise<boolean> {
    const blocked = await this.blockModel
      .findOne({
        user_id: userId,
        blocked_id: senderId,
      })
      .exec();

    return !!blocked;
  }
}
