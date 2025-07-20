import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

type CommentWithReplies = Comment & {
  _id: any;
  replies: CommentWithReplies[];
  totalReactions?: Record<string, number>;
};

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateCommentDto, userId: string): Promise<Comment> {
    return this.commentModel.create({ ...dto, author: userId });
  }

  async findByPost(postId: string): Promise<CommentWithReplies[]> {
    const allComments = await this.commentModel
      .find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();

    const commentMap = new Map<string, CommentWithReplies>();

    for (const raw of allComments) {
      const comment = raw as unknown as CommentWithReplies;
      comment.replies = [];

      // Tính tổng reactions — hỗ trợ cả Map hoặc object (lean)
      comment.totalReactions = {};

      if (comment.reactions instanceof Map) {
        comment.reactions.forEach((users, type) => {
          comment.totalReactions![type] = users.length;
        });
      } else if (comment.reactions && typeof comment.reactions === 'object') {
        for (const [type, users] of Object.entries(comment.reactions)) {
          comment.totalReactions![type] = Array.isArray(users)
            ? users.length
            : 0;
        }
      }

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

  async update(
    id: string,
    content: string,
    userId: string,
  ): Promise<boolean> {
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.isDeleted) return false;
    if (comment.author.toString() !== userId)
      throw new ForbiddenException('Không có quyền sửa');

    comment.content = content;
    await comment.save();
    return true;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Không tìm thấy comment');
    if (comment.author.toString() !== userId)
      throw new ForbiddenException('Bạn không được xóa comment này');

    comment.isDeleted = true;
    await comment.save();
    return true;
  }

  async reactToComment(
    commentId: string,
    userId: string,
    type: string,
  ): Promise<void> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment không tồn tại');

    if (!comment.reactions) {
      comment.reactions = new Map();
    }

    // Bỏ user khỏi mọi loại reaction trước đó
    for (const [key, users] of comment.reactions.entries()) {
      comment.reactions.set(
        key,
        users.filter((id) => id.toString() !== userId),
      );
    }

    // Nếu có chọn loại reaction mới, thêm user vào đó
    if (type) {
      const userObjectId = new Types.ObjectId(userId);
      const current = comment.reactions.get(type) || [];
      current.push(userObjectId);
      comment.reactions.set(type, current);
    }

    await comment.save();
  }
}
