import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum MetodoPagoType {
  TIQUETERA = 'tiquetera',
  EFECTIVO = 'efectivo',
}

export class CreatePedidoProductoDto {
  @IsUUID()
  productoId: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}

export class CreatePedidoDto {
  @IsUUID()
  ordenId: string;

  @IsUUID()
  clienteId: string;

  @IsEnum(MetodoPagoType)
  metodoPago: 'tiquetera' | 'efectivo';

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoProductoDto)
  productos: CreatePedidoProductoDto[];
} 