import { Injectable } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Interest } from './schema/interest.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class InterestService {
  constructor(
    @InjectModel(Interest.name) private interestModel: Model<Interest>,
  ) {}
  async create(createInterestDto: CreateInterestDto) {
    const create = await new this.interestModel(createInterestDto);
    return create.save();
  }
  async findAll() {
    const allInterest = await this.interestModel.find().exec();
    return allInterest;
  }
  async findByIds(ids: string[]): Promise<Interest[]> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    return this.interestModel.find({ _id: { $in: ids } });
  }
}
