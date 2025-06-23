import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    if (dto.type === 'video' && !dto.shortVideo) {
      throw new BadRequestException('shortVideo is required for type "video"');
    }

    return this.postModel.create({ ...dto, author: userId });
  }

  async update(id: string, dto: CreatePostDto, userId: string): Promise<Post | null> {
    const post = await this.postModel.findById(id);
    if (!post) return null;
    if (post.author.toString() !== userId.toString()) return null;

    post.title = dto.title;
    post.content = dto.content;
    post.shortVideo = dto.shortVideo;
    post.type = dto.type;

    await post.save();
    return post;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const post = await this.postModel.findById(id);
    if (!post) return false;
    if (post.author.toString() !== userId.toString()) return false;

    await this.postModel.deleteOne({ _id: id });
    return true;
  }
}
