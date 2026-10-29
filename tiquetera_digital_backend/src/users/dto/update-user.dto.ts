import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false, description: 'Nueva contraseña' })
  @IsString()
  @IsOptional()
  password?: string;
  
  @ApiProperty({ required: false, description: 'Nuevo rol' })
  @IsString()
  @IsOptional()
  role?: string;
  
  @ApiProperty({ required: false, description: 'Estado de activación' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @ApiProperty({ required: false, description: 'Nueva cédula o identificación' })
  @IsString()
  @IsOptional()
  cedula?: string;
  
  @ApiProperty({ required: false, description: 'Nuevo PIN de 4 dígitos' })
  @IsString()
  @IsOptional()
  pin?: string;
  
  // Campo interno para contrasena
  get contrasena(): string | undefined {
    return this.password;
  }
  
  // Campo interno para activo
  get activo(): boolean | undefined {
    return this.isActive;
  }
} 