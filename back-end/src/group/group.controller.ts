import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    const ownerId = req.user.userId;
    return this.groupService.create(createGroupDto, ownerId);
  }

  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID nhóm không hợp lệ');
    }
    return this.groupService.findById(id);
  }
  
  @Post(':groupId/request-join')
  async requestToJoin(@Req() req: any, @Param('groupId') groupId: string) {
    const userId = req.user.userId;
    return this.groupService.requestToJoin(groupId, userId);
  }

  @Get(':groupId/pending-members')
  async getPendingMembers(@Req() req: any, @Param('groupId') groupId: string) {
    const ownerId = req.user.userId;
    return this.groupService.getPendingMembers(groupId, ownerId);
  }

  @Post(':groupId/process-request')
  async processJoinRequest(
    @Req() req: any,
    @Param('groupId') groupId: string,
    @Body() body: { targetUserId: string; action: 'accept' | 'reject' },
  ) {
    const ownerId = req.user.userId;
    const { targetUserId, action } = body;

    if (!targetUserId || !action || !['accept', 'reject'].includes(action)) {
      throw new BadRequestException('Dữ liệu không hợp lệ. Cần targetUserId và action (accept/reject).');
    }
    
    return this.groupService.processJoinRequest(groupId, ownerId, targetUserId, action);
  }
}