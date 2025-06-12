import { Injectable } from '@nestjs/common';
import { CreateGlobalRoleDto } from './dto/create-global-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GlobalRole } from './schema/global-role.schema';
import { Model } from 'mongoose';

@Injectable()
export class GlobalRoleService {
  constructor(
    @InjectModel(GlobalRole.name) private globalRoleModel: Model<GlobalRole>,
  ) {}
  create(createGlobalRoleDto: CreateGlobalRoleDto) {
    const createdGlobalRole = new this.globalRoleModel(createGlobalRoleDto);
    return createdGlobalRole.save();
  }
  findByName(name: string): Promise<GlobalRole | null> {
    return this.globalRoleModel.findOne({ name }).exec();
  }
}
