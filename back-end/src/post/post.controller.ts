import {
  Controller,
  Post as HttpPost,
  Body,
  Req,
  UseGuards,
  Param,
  Put,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId = req.user.userId;
    return this.postsService.create(createPostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreatePostDto, @Req() req) {
    const updated = await this.postsService.update(id, body, req.user.userId);
    if (!updated) throw new ForbiddenException('Bạn không có quyền sửa bài này');
    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    const deleted = await this.postsService.delete(id, req.user.userId);
    if (!deleted) throw new ForbiddenException('Bạn không có quyền xóa bài này');
    return { message: 'Xóa bài viết thành công' };
  }
}
