import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GroupRole, GroupRoleDocument } from './schema/group-role.schema';
import { Model } from 'mongoose';
import { GroupMemberService } from 'src/group-member/group-member.service';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectModel(GroupRole.name) private groupRoleModel: Model<GroupRoleDocument>,
    private readonly groupMemService: GroupMemberService,
  ) {}

  /**
   * Tìm một vai trò theo tên. Nếu không tồn tại, tự động tạo ra vai trò 'owner' hoặc 'member'.
   */
  async findName(name: string): Promise<GroupRoleDocument> {
    const existingRole = await this.groupRoleModel.findOne({ name }).exec();

    if (existingRole) {
      return existingRole;
    }

    // Nếu không tìm thấy, chỉ tự động tạo cho 'owner' và 'member'
    if (name === 'owner' || name === 'member') {
      let defaultAccess: string[] = [];
      let defaultColor = '#E0E0E0';

      if (name === 'owner') {
        defaultAccess = ['manage_members', 'edit_group', 'delete_group'];
        defaultColor = '#FFD700';
      } else { // name === 'member'
        defaultAccess = ['view_content', 'post_message'];
      }
      
      console.log(`Vai trò "${name}" không tồn tại, đang tự động tạo...`);
      // Logic này giờ đã hợp lệ vì group_id không còn là trường bắt buộc
      const newRole = new this.groupRoleModel({
        name: name,
        access: defaultAccess,
        color: defaultColor,
      });
      return newRole.save();
    }
    
    throw new NotFoundException(`Vai trò mặc định "${name}" không được định nghĩa.`);
  }

  async create(createGroupRoleDto: CreateGroupRoleDto): Promise<GroupRole> {
    const created = new this.groupRoleModel(createGroupRoleDto);
    return created.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.groupRoleModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`GroupRole với id ${id} không tìm thấy`);
    }
    return { message: `Đã xóa GroupRole với id ${id} thành công` };
  }
  
  async findAll(): Promise<GroupRole[]> {
    return this.groupRoleModel.find().exec();
  }

  async AddGroupRoleToMember(
    groupId: string,
    userId: string,
    groupRoleId: string,
  ): Promise<void> {
    const isMember = await this.groupMemService.isMember(userId, groupId);
    if (!isMember) {
      throw new NotFoundException(`Người dùng không phải là thành viên của nhóm`);
    }
    await this.groupMemService.updateMemberRole(userId, groupId, groupRoleId);
  }
}