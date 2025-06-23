import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GroupRole } from './schema/group-role.schema';
import { Model, Document } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { GroupMemberService } from 'src/group-member/group-member.service';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectModel(GroupRole.name) private groupRoleModel: Model<GroupRole>,
    private readonly userService: UserService,
    private readonly groupMemService: GroupMemberService,
  ) {}

  async create(createGroupRoleDto: CreateGroupRoleDto): Promise<GroupRole> {
    const created = new this.groupRoleModel(createGroupRoleDto);
    return created.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.groupRoleModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`GroupRole with id ${id} not found`);
    }
    return { message: `Deleted GroupRole with id ${id} successfully` };
  }
  async findAll(): Promise<GroupRole[]> {
    return this.groupRoleModel.find().exec();
  }
  async findName(name: string): Promise<(GroupRole & Document) | null> {
    return this.groupRoleModel.findOne({ name }).exec();
  }
  async AddGroupRoleToMember(
    groupId: string,
    userId: string,
    groupRoleId: string,
  ): Promise<void> {
    const isMember = await this.groupMemService.isMember(userId, groupId);
    if (!isMember) {
      throw new NotFoundException(`User  is not a member of group `);
    }
    const addRole = await this.groupMemService.updateMemberRole(
      userId,
      groupId,
      groupRoleId,
    );
  }
}
