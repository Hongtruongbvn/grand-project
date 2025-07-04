import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { GroupRoleModule } from 'src/group-role/group-role.module';
import { UserModule } from 'src/user/user.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { Channel, ChannelSchema } from './schema/channel.schema';

@Module({
  imports: [
    ChatroomModule,
    NotificationModule,
    GroupMemberModule,
    GroupRoleModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Channel.name, schema: ChannelSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
