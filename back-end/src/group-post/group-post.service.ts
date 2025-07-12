import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { GroupPost, GroupPostDocument } from './schema/group-post.schema';
import { GroupMember } from 'src/group-member/schema/group-member.schema';

@Injectable()
export class GroupPostService {
  constructor(
    @InjectModel(GroupPost.name) private model: Model<GroupPostDocument>,
    @InjectModel(GroupMember.name) private memberModel: Model<GroupMember>,
  ) {}

  async create(groupId: string, dto: CreateGroupPostDto, userId: string) {
    // ✅ Kiểm tra người dùng có phải thành viên nhóm không
    const isMember = await this.memberModel.exists({
      group_id: groupId,
      user_id: userId,
      isActive: true,
    });

    if (!isMember) {
      throw new ForbiddenException('Bạn không phải thành viên của nhóm này');
    }

    if (dto.type === 'video' && !dto.shortVideo && (!dto.mediaUrls || dto.mediaUrls.length === 0)) {
      throw new BadRequestException('Video post requires a video link or uploaded video');
    }

    if (!dto.type) {
      if (dto.mediaUrls?.length && dto.shortVideo) dto.type = 'mixed';
      else if (dto.mediaUrls?.length) dto.type = 'mixed';
      else if (dto.shortVideo) dto.type = 'video';
      else dto.type = 'text';
    }

    return this.model.create({
      ...dto,
      author: userId,
      group: groupId,
    });
  }

  async findByGroup(groupId: string) {
    return this.model.find({ group: groupId }).sort({ createdAt: -1 }).populate('author', 'name avatar').exec();
  }
}
