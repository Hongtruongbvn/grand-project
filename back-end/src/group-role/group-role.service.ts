import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GroupRole } from './schema/group-role.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectModel(GroupRole.name) private groupRoleModel: Model<GroupRole>,
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
}
