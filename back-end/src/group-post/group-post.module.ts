import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupPostService } from './group-post.service';
import { GroupPostController } from './group-post.controller';
import { GroupPost, GroupPostSchema } from './schema/group-post.schema';
import { GroupMember, GroupMemberSchema } from 'src/group-member/schema/group-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupPost.name, schema: GroupPostSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
  ],
  providers: [GroupPostService],
  controllers: [GroupPostController],
})
export class GroupPostModule {}