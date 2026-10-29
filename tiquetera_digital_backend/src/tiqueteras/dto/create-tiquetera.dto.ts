import { IsNumber, IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTiqueteraDto {
  @ApiProperty({
    example: 'uuid-del-cliente',
    description: 'ID del cliente asociado a la tiquetera'
  })
  @IsString()
  cliente_id: string;

  @ApiProperty({
    example: 30,
    description: 'Cantidad de tickets/comidas que el cliente puede consumir',
    default: 30
  })
  @IsNumber()
  saldoInicial: number;

  @ApiProperty({
    example: 225000,
    description: 'Precio pagado por la tiquetera en pesos',
    default: 225000,
    required: false
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Fecha de vencimiento de la tiquetera (opcional)',
    required: false
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fechaVencimiento?: Date;

  @ApiProperty({
    example: true,
    description: 'Indica si la tiquetera está activa',
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  activa?: boolean;
} 