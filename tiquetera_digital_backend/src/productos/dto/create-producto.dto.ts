import { IsString, IsNumber, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsUUID()
  categoriaId: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
} 