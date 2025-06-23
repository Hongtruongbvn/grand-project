import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Group } from 'src/group/schema/group.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async searchAll(query: string): Promise<{ users: User[]; groups: Group[] }> {
    const regex = new RegExp(query, 'i'); // 'i' để không phân biệt hoa thường

    // Tìm kiếm song song user và group để tăng hiệu năng
    const [users, groups] = await Promise.all([
      this.userModel.find({ username: regex }).limit(10).exec(),
      this.groupModel.find({ name: regex }).limit(10).exec(),
    ]);

    return { users, groups };
  }
}