import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    if (dto.type === 'video' && !dto.shortVideo && (!dto.mediaUrls || dto.mediaUrls.length === 0)) {
      throw new BadRequestException('Video bài viết cần ít nhất 1 đường dẫn video');
    }

    if (!dto.type) {
      if (dto.mediaUrls?.length && dto.shortVideo) dto.type = 'mixed';
      else if (dto.mediaUrls?.length) dto.type = 'mixed';
      else if (dto.shortVideo) dto.type = 'video';
      else dto.type = 'text';
    }

    if (!dto.visibility) {
      dto.visibility = 'public';
    }

    return this.postModel.create({ ...dto, author: userId });
  }

  async update(id: string, dto: UpdatePostDto, userId: string): Promise<Post | null> {
    const post = await this.postModel.findById(id);
    if (!post || post.author.toString() !== userId.toString()) return null;

    // Nếu truyền media mới thì xác định lại type nếu không có
    if (!dto.type) {
      if (dto.mediaUrls?.length && dto.shortVideo) post.type = 'mixed';
      else if (dto.mediaUrls?.length) post.type = 'mixed';
      else if (dto.shortVideo) post.type = 'video';
      else post.type = 'text';
    }

    if (dto.title !== undefined) post.title = dto.title;
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.shortVideo !== undefined) post.shortVideo = dto.shortVideo;
    if (dto.mediaUrls !== undefined) post.mediaUrls = dto.mediaUrls;
    if (dto.type !== undefined) post.type = dto.type;
    if (dto.visibility !== undefined) post.visibility = dto.visibility;

    await post.save();
    return post;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const post = await this.postModel.findById(id);
    if (!post || post.author.toString() !== userId.toString()) return false;

    await this.postModel.deleteOne({ _id: id });
    return true;
  }

  async findAll(userId: string): Promise<Post[]> {
    const friends = []; // TODO: get friends of userId nếu có logic bạn bè

    return this.postModel
      .find({
        $or: [
          { visibility: 'public' },
          { visibility: 'friends', author: { $in: [userId, ...friends] } },
          { author: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .exec();
  }

  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).populate('author', 'name avatar').exec();
  }
}
