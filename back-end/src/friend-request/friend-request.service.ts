import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schema/friend-request.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendFriendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) throw new ConflictException('Cannot friend yourself');

    const existing = await this.friendRequestModel.findOne({
      fromUserId, toUserId, status: 'pending',
    });
    if (existing) throw new ConflictException('Friend request already sent');

    return this.friendRequestModel.create({
      fromUserId: new Types.ObjectId(fromUserId),
      toUserId: new Types.ObjectId(toUserId),
      status: 'pending',
    });
  }

  async acceptFriendRequest(requestId: string) {
    const request = await this.friendRequestModel.findById(requestId);
    if (!request) throw new NotFoundException('Friend request not found');

    request.status = 'accepted';
    await request.save();

    await this.userModel.updateOne(
      { _id: request.fromUserId },
      { $addToSet: { friend_id: request.toUserId } },
    );
    await this.userModel.updateOne(
      { _id: request.toUserId },
      { $addToSet: { friend_id: request.fromUserId } },
    );

    return request;
  }

    async rejectFriendRequest(requestId: string) {
    const request = await this.friendRequestModel.findById(requestId);
    if (!request) throw new NotFoundException('Friend request not found');

    request.status = 'rejected';
    await request.save();
    return { message: 'Friend request rejected successfully' };
    }

}
