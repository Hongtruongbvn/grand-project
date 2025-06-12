import { Injectable } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GroupMember } from './schema/group-member.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectModel(GroupMember.name) private memberModel: Model<GroupMember>,
  ) {}
  async RequestJoin(
    memDto: CreateGroupMemberDto,
    user_id: string,
    group_id: String,
    group_role: string,
  ) {
    
  }
}
