import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupMember, GroupMemberDocument } from './schema/group-member.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GroupMember.name) private memberModel: Model<GroupMemberDocument>,
  ) {}

  // === SỬA LỖI Ở ĐÂY: Nhận vào `user: UserDocument` ===
  async addOwner(groupId: string, user: UserDocument, ownerRoleId: string) {
    const ownerMember = new this.memberModel({
      name: user.username,
      group_id: new Types.ObjectId(groupId),
      user_id: user._id, // Giờ đây TypeScript sẽ hiểu user._id
      group_role_id: new Types.ObjectId(ownerRoleId),
      isActive: true,
      joinedAt: new Date(),
    });
    return await ownerMember.save();
  }

  // === SỬA LỖI Ở ĐÂY: Nhận vào `user: UserDocument` ===
  async createJoinRequest(groupId: string, user: UserDocument, memberRoleId: string) {
    const newMemberRequest = new this.memberModel({
      name: user.username,
      group_id: new Types.ObjectId(groupId),
      user_id: user._id, // Giờ đây TypeScript sẽ hiểu user._id
      group_role_id: new Types.ObjectId(memberRoleId),
      isActive: false,
    });
    return await newMemberRequest.save();
  }

  async findPendingMember(userId: string, groupId: string): Promise<GroupMemberDocument | null> {
    return this.memberModel.findOne({
      user_id: new Types.ObjectId(userId),
      group_id: new Types.ObjectId(groupId),
      isActive: false,
    }).exec();
  }

  async findPendingMembersForGroup(groupId: string): Promise<GroupMemberDocument[]> {
    return this.memberModel
      .find({
        group_id: new Types.ObjectId(groupId),
        isActive: false,
      })
      .populate('user_id', 'username avatar')
      .exec();
  }

  // === THÊM LẠI HÀM BỊ THIẾU ===
  // Đổi tên findMember thành isMember để khớp với lời gọi từ GroupRoleService
  async isMember(user_id: string, group_id: string): Promise<GroupMemberDocument | null> {
    return this.memberModel.findOne({
      user_id: new Types.ObjectId(user_id),
      group_id: new Types.ObjectId(group_id),
    }).exec();
  }
  
  // === THÊM LẠI HÀM BỊ THIẾU ===
  async updateMemberRole(userId: string, groupId: string, groupRoleId: string): Promise<void> {
    const updated = await this.memberModel.findOneAndUpdate(
      {
        user_id: new Types.ObjectId(userId),
        group_id: new Types.ObjectId(groupId),
      },
      { group_role_id: new Types.ObjectId(groupRoleId) },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Không tìm thấy thành viên nhóm.');
    }
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.memberModel.deleteOne({ _id: new Types.ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Không tìm thấy bản ghi thành viên để xóa.');
    }
  }
}