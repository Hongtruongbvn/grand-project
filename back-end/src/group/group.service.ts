import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schema/group.schema';
import { Model, Types } from 'mongoose';
import { GroupMemberService } from 'src/group-member/group-member.service';
import { NotificationService } from 'src/notification/notification.service';
import { GroupRoleService } from 'src/group-role/group-role.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private readonly groupMemService: GroupMemberService,
    private readonly notificationService: NotificationService,
    private readonly groupRoleService: GroupRoleService,
    private readonly chatRoomService: ChatroomService,
    private readonly userService: UserService,
  ) {}

  async create(createGroupDto: CreateGroupDto, ownerId: string): Promise<Group> {
    const owner = await this.userService.findById(ownerId);
    if (!owner) throw new NotFoundException('Không tìm thấy người dùng chủ sở hữu.');

    const createdGroup = new this.groupModel({
      ...createGroupDto,
      owner: owner._id, // Không còn lỗi
      members: [owner._id], // Không còn lỗi
    });
    const savedGroup = await createdGroup.save();
    
    const ownerRole = await this.groupRoleService.findName('owner');
    if (!ownerRole) throw new NotFoundException('Vai trò "owner" không tồn tại.');
    
    await this.groupMemService.addOwner(savedGroup._id.toString(), owner, ownerRole._id.toString());
        await this.chatRoomService.createChatroom(
      savedGroup.name,
      ownerId,
      'group',
      [ownerId] // Thành viên ban đầu chỉ có chủ nhóm
    );
    
    return savedGroup;
  }

  // ... các hàm khác giữ nguyên ...
  async findById(id: string): Promise<Group> {
    const group = await this.groupModel
        .findById(id)
        .populate('owner', 'username avatar')
        .populate('members', 'username avatar')
        .exec();
    if (!group) throw new NotFoundException('Không tìm thấy nhóm');
    return group;
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().populate('owner', 'username').exec();
  }

  async requestToJoin(groupId: string, userId: string): Promise<{ message: string }> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy nhóm.');

    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng.');

    const existingMember = await this.groupMemService.isMember(userId, groupId);
    if (existingMember) {
        throw new BadRequestException(existingMember.isActive ? 'Bạn đã là thành viên của nhóm này.' : 'Bạn đã gửi yêu cầu tham gia trước đó.');
    }

    const memberRole = await this.groupRoleService.findName('member');
    if (!memberRole) throw new NotFoundException('Vai trò "member" không tồn tại.');

    await this.groupMemService.createJoinRequest(groupId, user, memberRole._id.toString());

    await this.notificationService.createNoTi(
        `${user.username} đã xin vào nhóm "${group.name}".`,
        group.owner.toString(),
        userId,
    );

    return { message: 'Đã gửi yêu cầu tham gia nhóm thành công.' };
  }
  
  async getPendingMembers(groupId: string, ownerId: string): Promise<any> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy nhóm.');
    if (group.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền xem danh sách này.');
    }
    return this.groupMemService.findPendingMembersForGroup(groupId);
  }

  async processJoinRequest(
    groupId: string,
    ownerId: string,
    targetUserId: string,
    action: 'accept' | 'reject',
  ): Promise<{ message: string }> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy nhóm.');
    if (group.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này.');
    }
    
    const memberRequest = await this.groupMemService.findPendingMember(targetUserId, groupId);
    if (!memberRequest) {
      throw new NotFoundException('Không tìm thấy yêu cầu tham gia từ người dùng này.');
    }

    if (action === 'accept') {
      memberRequest.isActive = true;
      memberRequest.joinedAt = new Date();
      await memberRequest.save();

      group.members.push(new Types.ObjectId(targetUserId));
      await group.save();
      
      await this.notificationService.createNoTi(
        `Yêu cầu tham gia nhóm "${group.name}" của bạn đã được chấp nhận.`,
        targetUserId,
        ownerId,
      );
      return { message: 'Đã chấp nhận thành viên mới.' };
    } else {
      await this.groupMemService.deleteById(memberRequest._id.toString());
      return { message: 'Đã từ chối yêu cầu tham gia.' };
    }
  }
}