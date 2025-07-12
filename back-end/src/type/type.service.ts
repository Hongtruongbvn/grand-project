import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Type } from './schema/type.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(Type.name) private readonly typeModel: Model<Type>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async createType(name: string, price: number): Promise<Type> {
    const type = new this.typeModel({ name, price });
    return await type.save();
  }
  async findName(name: string) {
    const find = await this.typeModel.findOne({ name }).exec();
    return find;
  }
  async assignUser(user_id: string) {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new BadRequestException('user not found');
      return;
    }
    const type = await this.findName('user');
    if (!type) {
      throw new BadRequestException('type not found');
      return;
    }
  }
  
}
