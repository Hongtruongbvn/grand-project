import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { BlockModule } from './block/block.module';
import { StoryModule } from './story/story.module';
import { MessageModule } from './message/message.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { GlobalRoleModule } from './global-role/global-role.module';
import { TypeModule } from './type/type.module';
import { InterestModule } from './interest/interest.module';

import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './group/group.module';
import { GroupRoleModule } from './group-role/group-role.module';
import { GroupMemberModule } from './group-member/group-member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOOSE as string),

    UserModule,
    AuthModule,
    RoleModule,
    PostModule,
    CommentModule,
    TypeModule,
    InterestModule,
    ReportModule,
    BlockModule,
    StoryModule,
    MessageModule,
    ChatroomModule,
    GlobalRoleModule,
    GroupModule,
    GroupRoleModule,
    GroupMemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
