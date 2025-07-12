import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { UserModule } from 'src/user/user.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { NotificationModule } from 'src/notification/notification.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { GroupRoleModule } from 'src/group-role/group-role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    // === SỬA LỖI: Dùng forwardRef() ===
    forwardRef(() => UserModule),
    ChatroomModule,
    NotificationModule,
    GroupMemberModule,
    GroupRoleModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}