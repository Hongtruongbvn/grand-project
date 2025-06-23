import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { GroupMemberService } from 'src/group-member/group-member.service';
import { NotificationService } from 'src/notification/notification.service';
import { GroupRoleService } from 'src/group-role/group-role.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private readonly userService: UserService,
    private readonly groupMemService: GroupMemberService,
    private readonly notificationService: NotificationService,
    private readonly groupRoleService: GroupRoleService,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    ownerId: string,
  ): Promise<Group> {
    const ownerObjectId = new Types.ObjectId(ownerId); //nam thêm
    const created = new this.groupModel({
      ...createGroupDto,
      owner: ownerObjectId, // Nam sửa
      members: [ownerObjectId], // Nam thêm
    });
    return created.save();
  }

  async addInterestToGroup(
    groupId: string,
    interestId: string,
  ): Promise<Group> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const interestObjId = new Types.ObjectId(interestId);
    if (!group.interest_id.includes(interestObjId)) {
      group.interest_id.push(interestObjId);
    }

    return group.save();
  }

  // ===== THÊM HÀM MỚI NÀY VÀO ===== Nam thêm
  async findAll(): Promise<Group[]> {
    // .populate('owner', 'username') sẽ lấy cả thông tin username của người tạo nhóm
    return this.groupModel.find().populate('owner', 'username').exec();
  }
  async addMemberToGroup(
    sender_id: string,
    receiver_id: string,
    groupId: string,
  ) {
    const sender = await this.userService.findById(sender_id);
    const receiver = await this.userService.findById(receiver_id);
    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const notification = await this.notificationService.createNoTi(
      'add group request',
      receiver_id,
      sender_id,
    );
    const role = await this.groupRoleService.findName('member');
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const id = role._id as Types.ObjectId;
    const groupMember = await this.groupMemService.RequestJoin(
      receiver.username,
      groupId,
      receiver_id,
      id.toString(),
    );
  }

  // ===== THÊM HÀM NÀY VÀO ===== Nam thêm
  async findById(id: string): Promise<Group> {
    const group = await this.groupModel
      .findById(id)
      .populate('owner members', 'username avatar')
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async isJoined(userId: string, groupId: string): Promise<boolean> {
    const member = await this.groupMemService.isMember(userId, groupId);
    return !!member;
  }
  async aproveJoinRequest(userId: string, groupId: string) {
    const member = await this.groupMemService.findMemberById(userId, groupId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    member.isActive = true;
    member.joinedAt = new Date();
    const group = await this.groupModel.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    group.members = Array.from(
      new Set([
        ...group.members.map((id) => id.toString()),
        member.user_id.toString(), // hoặc member._id nếu bạn dùng memberId làm đại diện
      ]),
    ).map((id) => new Types.ObjectId(id));

    // Lưu lại group đã cập nhật
    await group.save();
    return member.save();
  }
  async rejectJoinRequest(
    userId: string,
    groupId: string,
  ): Promise<{ message: string }> {
    const member = await this.groupMemService.findMemberById(userId, groupId);
    if (!member) {
      throw new NotFoundException('Join request not found');
    }
    const isJoined = await this.isJoined(userId, groupId);
    if (isJoined) {
      throw new NotFoundException('You are already a member of this group');
    }
    await this.groupMemService.Delete(member._id.toString());

    return { message: 'Join request rejected and deleted successfully' };
  }

  async findByName(name: string): Promise<Group> {
    const group = await this.groupModel.findOne({ name }).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
  async createRquestJoin(user_id: string, group_id: string) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const notification = await this.notificationService.createNoTi(
      'new join request',
      group.owner.toString(),
      user_id,
    );
  }
  async actJoinRequest(user_id: string, group_id: string, sender_id: string) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (group.owner.toString() == user_id) {
      const member = await this.groupMemService.isMember(sender_id, group_id);
      if (!member) {
        throw new NotFoundException('Member not found in this group');
      }
      const isJoined = await this.isJoined(sender_id, group_id);
      if (isJoined) {
        throw new NotFoundException(
          'this member are already a member of this group',
        );
      }
      member.isActive = true;
      member.joinedAt = new Date();
      const group = await this.groupModel.findById(group_id);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      group.members = Array.from(
        new Set([
          ...group.members.map((id) => id.toString()),
          member.user_id.toString(),
        ]),
      ).map((id) => new Types.ObjectId(id));

      await group.save();
      return member.save();
    } else {
      throw new NotFoundException('You are not the owner of this group');
    }
  }
  async rejectJoinRequestNyOwner(
    user_id: string,
    group_id: string,
    sender_id: string,
  ) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (group.owner.toString() == user_id) {
      const member = await this.groupMemService.isMember(sender_id, group_id);
      if (!member) {
        throw new NotFoundException('Member not found in this group');
      }
      await this.groupMemService.DeleteByUserIdAndGroupId(sender_id, group_id);
      return { message: 'Join request rejected and deleted successfully' };
    } else {
      throw new NotFoundException('You are not the owner of this group');
    }
  }
}
