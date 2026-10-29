import { PartialType } from '@nestjs/mapped-types';
import { CreateTiqueteraDto } from './create-tiquetera.dto';

export class UpdateTiqueteraDto extends PartialType(CreateTiqueteraDto) {} 