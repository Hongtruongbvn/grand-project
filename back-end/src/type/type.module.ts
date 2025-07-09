// type.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { Type, TypeSchema } from './schema/type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
  ],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
