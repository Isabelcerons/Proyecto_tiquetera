import { PartialType } from '@nestjs/swagger';
import { CreateMesaDto } from './create-mesa.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMesaDto extends PartialType(CreateMesaDto) {
    @IsOptional()
    @IsNumber()
    estado_id?: number;
} 