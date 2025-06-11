import { Injectable } from '@nestjs/common';
import { CreateGlobalRoleDto } from './dto/create-global-role.dto';
import { UpdateGlobalRoleDto } from './dto/update-global-role.dto';

@Injectable()
export class GlobalRoleService {
  create(createGlobalRoleDto: CreateGlobalRoleDto) {
    return 'This action adds a new globalRole';
  }

  findAll() {
    return `This action returns all globalRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globalRole`;
  }

  update(id: number, updateGlobalRoleDto: UpdateGlobalRoleDto) {
    return `This action updates a #${id} globalRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalRole`;
  }
}
