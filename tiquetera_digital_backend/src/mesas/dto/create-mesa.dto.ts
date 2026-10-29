import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Estado } from '../../estados/entities/estado.entity';

export class CreateMesaDto {
  @IsNotEmpty()
  @IsNumber()
  numero: number;

  @IsNotEmpty()
  @IsNumber()
  capacidad: number;

  @ApiProperty({ description: 'Zona de la mesa', example: 'Terraza' })
  @IsOptional()
  @IsString()
  zona?: string;

  @ApiProperty({ description: 'Estado inicial de la mesa', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  estado: number;
} 