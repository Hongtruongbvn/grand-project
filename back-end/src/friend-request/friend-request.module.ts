import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schema/friend-request.schema';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
