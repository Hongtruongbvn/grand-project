import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Report } from './schema/report.schema';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async reportUser(
    userId: string,
    targetId: string,
    reason: string,
    why: string,
  ) {
    const report = new this.reportModel({
      user_id: new Types.ObjectId(targetId),
      reporter_id: new Types.ObjectId(userId),
      reason,
      why,
    });
    const reporter = await this.userService.findById(userId);
    await this.notificationService.createNoTi(
      `Bạn đã bị report bởi ${reporter.username}`,
      targetId,
      userId,
    );

    return await report.save();
  }
}
