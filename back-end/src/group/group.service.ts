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
    const created = new this.groupModel({
      ...createGroupDto,
      owner: new Types.ObjectId(ownerId),
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
    const notification = await this.notificationService.createInviteNT(
      'message',
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
}
