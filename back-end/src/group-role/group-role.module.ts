import { Module, forwardRef } from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { GroupRoleController } from './group-role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRole, GroupRoleSchema } from './schema/group-role.schema';
import { GroupMemberModule } from 'src/group-member/group-member.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupRole.name, schema: GroupRoleSchema }]),
    // Sửa lỗi: Dùng forwardRef()
    forwardRef(() => GroupMemberModule),
    forwardRef(() => UserModule),
  ],
  controllers: [GroupRoleController],
  providers: [GroupRoleService],
  exports: [GroupRoleService],
})
export class GroupRoleModule {}