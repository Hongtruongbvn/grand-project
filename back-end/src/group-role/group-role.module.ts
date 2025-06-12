import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRole, GroupRoleSchema } from './schema/group-role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupRole.name, schema: GroupRoleSchema },
    ]),
  ],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
})
export class GroupRoleModule {}
