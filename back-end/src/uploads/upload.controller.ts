import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadController {
  @Post('media')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/media',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowed = ['image/', 'video/'];
      if (!allowed.some(type => file.mimetype.startsWith(type))) {
        return cb(new Error('Chỉ cho phép ảnh hoặc video'), false);
      }
      cb(null, true);
    },
  }))
  upload(@UploadedFile() file: Express.Multer.File) {
    const url = `/uploads/media/${file.filename}`;
    return { url };
  }
}
