import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginPinDto } from './dto/login-pin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`Intentando login para usuario: ${loginDto.username}`);
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      this.logger.error('Usuario no encontrado');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    this.logger.log(`Usuario encontrado: ${user.usuario}`);
    this.logger.log(`Comparando password: ${loginDto.password} con hash: ${user.contrasena}`);
    const passwordMatch = await bcrypt.compare(loginDto.password, user.contrasena);
    if (!passwordMatch) {
      this.logger.error('Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, username: user.usuario, role: user.rol };
    this.logger.log('Login exitoso');
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.usuario,
        role: user.rol,
        nombre: user.nombre
      }
    };
  }

  async loginWithPin(loginPinDto: LoginPinDto) {
    this.logger.log(`Intentando login con PIN para cédula: ${loginPinDto.cedula}`);
    const user = await this.usersService.findByCedula(loginPinDto.cedula);
    if (!user) {
      this.logger.error('Usuario no encontrado');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Verificar que el usuario sea un cliente
    if (user.rol !== 'cliente') {
      this.logger.error(`Rol incorrecto: ${user.rol}, se requiere rol 'cliente'`);
      throw new UnauthorizedException('Acceso denegado');
    }
    
    this.logger.log(`Usuario encontrado: ${user.usuario}`);
    
    // Comparar el PIN directamente (sin hash)
    if (user.pin !== loginPinDto.pin) {
      this.logger.error('PIN incorrecto');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { sub: user.id, username: user.usuario, role: user.rol };
    this.logger.log('Login con PIN exitoso');
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.usuario,
        role: user.rol,
        nombre: user.nombre
      }
    };
  }
} 