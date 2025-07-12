import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupPostDto } from './create-group-post.dto';

export class UpdateGroupPostDto extends PartialType(CreateGroupPostDto) {}
