import { PartialType } from '@nestjs/mapped-types';
import { CreateInterestDto } from './create-interest.dto';

export class UpdateInterestDto extends PartialType(CreateInterestDto) {}
