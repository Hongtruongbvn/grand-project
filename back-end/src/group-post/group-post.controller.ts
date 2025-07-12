import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('groups/:groupId/posts')
@UseGuards(JwtAuthGuard)
export class GroupPostController {
  constructor(private readonly service: GroupPostService) {}

  @Post()
  create(
    @Param('groupId') groupId: string,
    @Body() dto: CreateGroupPostDto,
    @Req() req,
  ) {
    return this.service.create(groupId, dto, req.user.userId);
  }

  @Get()
  getAll(@Param('groupId') groupId: string) {
    return this.service.findByGroup(groupId);
  }
}
