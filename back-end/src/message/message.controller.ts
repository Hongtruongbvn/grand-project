import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('message')
@UseGuards(JwtAuthGuard) // Áp dụng Guard cho toàn bộ controller
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // thư mục lưu
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // giới hạn 10MB
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only image/video files are allowed'), false);
        }
      },
    }),
  )
  async sendMessageWithMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { chatroomId: string; senderId: string; content?: string },
  ) {
    const mediaUrl = file ? `/uploads/${file.filename}` : undefined;
    const mediaType = file
      ? file.mimetype.startsWith('image')
        ? 'image'
        : 'video'
      : 'none';

    return this.messageService.createMessage({
      chatroomId: body.chatroomId,
      senderId: body.senderId,
      content: body.content,
      mediaUrl,
      mediaType,
    });
  }

  @Get(':roomId') // Route: GET /message/ID_PHONG_CHAT
  async getMessages(@Param('roomId') roomId: string) {
    return this.messageService.getMessages(roomId);
  }
}
