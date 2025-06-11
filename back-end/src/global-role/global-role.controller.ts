import { Controller, Post, Body } from '@nestjs/common';
import { GlobalRoleService } from './global-role.service';
import { CreateGlobalRoleDto } from './dto/create-global-role.dto';

@Controller('global-role')
export class GlobalRoleController {
  constructor(private readonly globalRoleService: GlobalRoleService) {}

  @Post()
  create(@Body() createGlobalRoleDto: CreateGlobalRoleDto) {
    return this.globalRoleService.create(createGlobalRoleDto);
  }
}
