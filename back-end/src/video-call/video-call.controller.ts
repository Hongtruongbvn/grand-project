import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VideoCallService } from './video-call.service';

@Controller('video-call')
export class VideoCallController {
  constructor(private readonly videoCallService: VideoCallService) {}
}
