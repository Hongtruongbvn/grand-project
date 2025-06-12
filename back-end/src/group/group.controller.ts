import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Request() req: any) {
    const ownerId = req.user['userId']; // lấy ID từ token JWT
    return await this.groupService.create(createGroupDto, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/add-interest/:interestId')
  async addInterest(
    @Param('id') groupId: string,
    @Param('interestId') interestId: string,
  ) {
    return await this.groupService.addInterestToGroup(groupId, interestId);
  }
}
