// back-end/src/user/user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { GlobalRoleModule } from 'src/global-role/global-role.module';
import { InterestModule } from 'src/interest/interest.module';
import { MailModule } from 'src/mail/mail.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { NotificationModule } from 'src/notification/notification.module';
import { GroupModule } from 'src/group/group.module';
import { ChatroomMemberModule } from 'src/chatroom-member/chatroom-member.module';
import { TypeModule } from 'src/type/type.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Dùng forwardRef cho các module có khả năng phụ thuộc ngược lại
    forwardRef(() => ChatroomModule),
    forwardRef(() => GroupModule),
    forwardRef(() => TypeModule),

    // Các module khác mà UserService cần
    GlobalRoleModule,
    InterestModule,
    MailModule,
    NotificationModule,
    ChatroomMemberModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
