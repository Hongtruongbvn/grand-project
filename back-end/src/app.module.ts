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
import { GroupModule } from './group/group.module';
import { StoryModule } from './story/story.module';
import { MessageModule } from './message/message.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { GlobalRoleModule } from './global-role/global-role.module';
import { TypeModule } from './type/type.module';
import { InterestModule } from './interest/interest.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    GroupModule,
    StoryModule,
    MessageModule,
    ChatroomModule,
    GlobalRoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
