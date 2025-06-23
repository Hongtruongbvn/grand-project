import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GroupMember } from './schema/group-member.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GroupMember.name) private memberModel: Model<GroupMember>,
  ) {}
  async RequestJoin(
    name: string,
    group_id: string,
    user_id: string,
    group_role_id: string,
  ) {
    const existing = await this.memberModel.findOne({
      group_id: new Types.ObjectId(group_id),
      user_id: new Types.ObjectId(user_id),
    });

    if (existing) {
      throw new ConflictException('You already requested or joined this group');
    }

    const newMember = new this.memberModel({
      name,
      group_id: new Types.ObjectId(group_id),
      user_id: new Types.ObjectId(user_id),
      group_role_id: new Types.ObjectId(group_role_id),
      isActive: false,
      joinedAt: new Date(),
    });

    return await newMember.save();
  }
  async isMember(user_id: string, group_id: string) {
    const member = await this.memberModel
      .findOne({
        user_id: new Types.ObjectId(user_id),
        group_id: new Types.ObjectId(group_id),
      })
      .exec();

    return member;
  }
  async updateMemberRole(
    userId: string,
    groupId: string,
    groupRoleId: string,
  ): Promise<void> {
    const updated = await this.memberModel.findOneAndUpdate(
      {
        user_id: new Types.ObjectId(userId),
        group_id: new Types.ObjectId(groupId),
      },
      {
        group_role_id: new Types.ObjectId(groupRoleId),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Group member not found');
    }
  }
  async findMemberById(userid: string, groupId: string) {
    const member = await this.memberModel
      .findOne({
        user_id: new Types.ObjectId(userid),
        group_id: new Types.ObjectId(groupId),
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }
    return member;
  }
  async Delete(id: string): Promise<void> {
    const result = await this.memberModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Group member not found');
    }
  }
  async DeleteByUserIdAndGroupId(
    userId: string,
    groupId: string,
  ): Promise<void> {
    const result = await this.memberModel.deleteOne({
      user_id: new Types.ObjectId(userId),
      group_id: new Types.ObjectId(groupId),
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Group member not found');
    }
  }
  async findById(id: string): Promise<GroupMember | null> {
    const member = await this.memberModel.findOne({ user_id: id }).exec();
    if (!member) {
      throw new NotFoundException('Group member not found');
    }
    return member;
  }
}
