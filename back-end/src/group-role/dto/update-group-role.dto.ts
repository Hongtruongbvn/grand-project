import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupRoleDto } from './create-group-role.dto';

export class UpdateGroupRoleDto extends PartialType(CreateGroupRoleDto) {}
