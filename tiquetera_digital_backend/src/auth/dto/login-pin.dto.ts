import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPinDto {
  @ApiProperty({ 
    example: '1234567890', 
    description: 'Número de cédula o identificación del cliente' 
  })
  @IsString()
  cedula: string;

  @ApiProperty({ 
    example: '1234', 
    description: 'PIN de 4 dígitos del cliente' 
  })
  @IsString()
  pin: string;
} 