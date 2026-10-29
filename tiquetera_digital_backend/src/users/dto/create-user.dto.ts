import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Marlene Garcia Muñoz', description: 'Nombre completo del cliente' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'marlen', description: 'Nombre de usuario único' })
  @IsString()
  usuario: string;

  @ApiProperty({ example: '1234', description: 'Contraseña del usuario' })
  @IsString()
  contrasena: string;

  @ApiProperty({ example: '123456789', description: 'Número de cédula o identificación' })
  @IsString()
  cedula: string;

  @ApiProperty({ example: '4321', description: 'PIN de 4 dígitos para pedir comida (no para login)', required: false })
  @IsString()
  @IsOptional()
  pin?: string;

  // El rol se fuerza a 'cliente' en el backend
  readonly rol = 'cliente';
} 