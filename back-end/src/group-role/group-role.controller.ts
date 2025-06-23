import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';

@Controller('group-role')
export class GroupRoleController {
  constructor(private readonly groupRoleService: GroupRoleService) {}
  @Post()
  async create(@Body() createGroupRoleDto: CreateGroupRoleDto) {
    return await this.groupRoleService.create(createGroupRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.groupRoleService.remove(id);
  }
  @Get()
  async findAll() {
    return await this.groupRoleService.findAll();
  }
  @Get(':name')
  async findName(@Param('name') name: string) {
    return await this.groupRoleService.findName(name);
  }
}
