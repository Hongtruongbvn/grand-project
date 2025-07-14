import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

// interface mở rộng để dùng replies
type CommentWithReplies = Comment & {
  _id: any;
  replies: CommentWithReplies[];
};

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(dto: CreateCommentDto, userId: string): Promise<Comment> {
    return this.commentModel.create({ ...dto, author: userId });
  }

  async findByPost(postId: string): Promise<CommentWithReplies[]> {
    const allComments = await this.commentModel
      .find({ post: postId, isDeleted: false })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();

    const commentMap = new Map<string, CommentWithReplies>();

    // Khởi tạo replies rỗng
    for (const raw of allComments) {
      const comment = raw as unknown as CommentWithReplies;
      comment.replies = [];
      commentMap.set(comment._id.toString(), comment);
    }

    const postComments: CommentWithReplies[] = [];

    for (const comment of commentMap.values()) {
      const parentId = comment.parentComment?.toString();
      if (parentId && commentMap.has(parentId)) {
        commentMap.get(parentId)!.replies.push(comment);
      } else {
        postComments.push(comment);
      }
    }

    return postComments;
  }

  async update(id: string, content: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.isDeleted) return false;
    if (comment.author.toString() !== userId) throw new ForbiddenException('Không có quyền sửa');

    comment.content = content;
    await comment.save();
    return true;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Không tìm thấy comment');
    if (comment.author.toString() !== userId) throw new ForbiddenException('Bạn không được xóa comment này');

    comment.isDeleted = true;
    await comment.save();
    return true;
  }
}
