import { Module } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRole, GroupRoleSchema } from './schema/group-role.schema';
import { UserModule } from 'src/user/user.module';
import { GroupMemberModule } from 'src/group-member/group-member.module';

@Module({
  imports: [
    GroupMemberModule,
    UserModule,
    MongooseModule.forFeature([
      { name: GroupRole.name, schema: GroupRoleSchema },
    ]),
  ],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
  exports: [GroupRoleService],
})
export class GroupRoleModule {}
