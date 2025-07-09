import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { Block, BlockSchema } from './schema/block.schema';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
