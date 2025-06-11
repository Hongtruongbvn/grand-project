// dto/update-global-role.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalRoleDto } from './create-global-role.dto';

export class UpdateGlobalRoleDto extends PartialType(CreateGlobalRoleDto) {}
