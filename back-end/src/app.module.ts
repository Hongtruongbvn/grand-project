import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { TypeModule } from './type/type.module';
import { InterestModule } from './interest/interest.module';
import { ReportModule } from './report/report.module';
import { BlockModule } from './block/block.module';
import { GroupModule } from './group/group.module';
import { StoryModule } from './story/story.module';
import { MessageModule } from './message/message.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/grand'),

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
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
