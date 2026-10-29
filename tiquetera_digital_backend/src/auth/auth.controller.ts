import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginPinDto } from './dto/login-pin.dto';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener un token JWT' })
  @ApiBody({
    schema: {
      example: {
        username: 'admin1',
        password: 'tu_contraseña'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Token JWT y datos del usuario.' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Recibiendo petición de login: ${JSON.stringify(loginDto)}`);
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log('Login exitoso');
      return result;
    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`);
      throw error;
    }
  }

  @Post('login-pin')
  @ApiOperation({ summary: 'Iniciar sesión como cliente usando cédula y PIN' })
  @ApiBody({
    schema: {
      example: {
        cedula: '1234567890',
        pin: '1234'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Token JWT y datos del usuario.' })
  async loginWithPin(@Body() loginPinDto: LoginPinDto) {
    this.logger.log(`Recibiendo petición de login con PIN: ${JSON.stringify(loginPinDto)}`);
    try {
      const result = await this.authService.loginWithPin(loginPinDto);
      this.logger.log('Login con PIN exitoso');
      return result;
    } catch (error) {
      this.logger.error(`Error en login con PIN: ${error.message}`);
      throw error;
    }
  }
} 