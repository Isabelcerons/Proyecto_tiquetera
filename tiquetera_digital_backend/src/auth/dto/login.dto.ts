import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'jenser', 
    description: 'Nombre de usuario para el login' 
  })
  @IsString()
  username: string;

  @ApiProperty({ 
    example: '1234', 
    description: 'Contraseña del usuario' 
  })
  @IsString()
  password: string;
} 