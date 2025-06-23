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
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { Group } from './schema/group.schema';

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

  // ===== THÊM ENDPOINT GET MỚI NÀY VÀO ===== Nam thêm
  @UseGuards(JwtAuthGuard) // Thêm Guard để bảo vệ
  @Get()
  async findAll() {
    return this.groupService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Post('add-member/:receiverId/:groupId')
  async addMemberToGroup(
    @Req() req: any,
    @Param('receiverId') receiverId: string,
    @Param('groupId') groupId: string,
  ) {
    const senderId = req.user.userId;
    return await this.groupService.addMemberToGroup(
      senderId,
      receiverId,
      groupId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('accept/:groupId')
  async acceptJoinRequest(@Req() req: any, @Param('groupId') groupId: string) {
    const userId = req.user.userId;
    return await this.groupService.aproveJoinRequest(userId, groupId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('reject/:groupId')
  async rejectJoinRequest(@Req() req: any, @Param('groupId') groupId: string) {
    const userId = req.user.userId;
    return await this.groupService.rejectJoinRequest(userId, groupId);
  }

  // ===== THÊM ENDPOINT NÀY VÀO ===== Nam thêm
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID nhóm không hợp lệ');
    }
    const group = await this.groupService.findById(id); // Giả sử bạn có hàm findById trong service
    if (!group) {
      throw new NotFoundException('Không tìm thấy nhóm');
    }
    return group;
  }
}
