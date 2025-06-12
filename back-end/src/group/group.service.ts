import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

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
}
