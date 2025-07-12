import { Module } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import { VideoCallController } from './video-call.controller';
import { VideoGateway } from './video.gateway';

@Module({
  controllers: [VideoCallController],
  providers: [VideoCallService, VideoGateway],
})
export class VideoCallModule {}
