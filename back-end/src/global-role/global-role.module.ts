import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalRoleService } from './global-role.service';
import { GlobalRoleController } from './global-role.controller';
import { GlobalRole, GlobalRoleSchema } from './schema/global-role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GlobalRole.name, schema: GlobalRoleSchema },
    ]),
  ],
  controllers: [GlobalRoleController],
  providers: [GlobalRoleService],
  exports: [GlobalRoleService],
})
export class GlobalRoleModule {}
