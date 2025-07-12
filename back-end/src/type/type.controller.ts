import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}
  @Post()
  async createType(@Body() body: { name: string; price: number }) {
    const { name, price } = body;
    return await this.typeService.createType(name, price);
  }
}
