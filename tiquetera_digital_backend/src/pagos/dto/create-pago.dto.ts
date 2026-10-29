import { IsNotEmpty, IsUUID, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePagoDto {
  @IsUUID()
  @IsNotEmpty()
  pedido_id: string;

  @IsEnum(['tiquetera', 'efectivo'])
  @IsNotEmpty()
  metodo_pago: 'tiquetera' | 'efectivo';

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  monto: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  monto_efectivo?: number;

  @IsUUID()
  @IsOptional()
  tiquetera_id?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  vuelto?: number;
} 