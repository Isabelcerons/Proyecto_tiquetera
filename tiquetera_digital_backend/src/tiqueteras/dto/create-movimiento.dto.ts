import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMovimiento } from '../entities/movimiento-tiquetera.entity';

export class CreateMovimientoDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la tiquetera asociada al movimiento'
  })
  @IsString()
  tiquetera_id: string;

  @ApiProperty({
    example: 'carga',
    description: 'Tipo de movimiento',
    enum: TipoMovimiento
  })
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento;

  @ApiProperty({
    example: 50,
    description: 'Monto del movimiento (positivo para cargas, negativo para consumos)'
  })
  @IsNumber()
  monto: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del pedido asociado (opcional)',
    required: false
  })
  @IsString()
  @IsOptional()
  pedido_id?: string;

  @ApiProperty({
    example: 'Carga inicial',
    description: 'Descripción del movimiento',
    required: false
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario que realiza el movimiento',
    required: false
  })
  @IsString()
  @IsOptional()
  usuario_id?: string;

  @ApiProperty({
    example: 'orden-123',
    description: 'Referencia adicional del movimiento (ej: orden, factura)',
    required: false
  })
  @IsString()
  @IsOptional()
  referencia?: string;
} 