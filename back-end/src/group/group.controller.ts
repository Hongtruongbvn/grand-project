import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('group_background', {
      storage: diskStorage({
        destination: './uploads/groups',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGroupDto: any,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;
    const imagePath = file ? `/uploads/groups/${file.filename}` : '';
    return this.groupService.create({ ...createGroupDto, group_background: imagePath }, ownerId);
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