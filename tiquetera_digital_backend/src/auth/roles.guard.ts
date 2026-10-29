import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se requieren roles específicos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener request y usuario de la solicitud
    const { user } = context.switchToHttp().getRequest();
    
    this.logger.debug(`Verificando roles. Usuario: ${JSON.stringify(user)}, Roles requeridos: ${JSON.stringify(requiredRoles)}`);
    
    // Si no hay usuario (no autenticado), no permitir acceso
    if (!user) {
      this.logger.warn('No se encontró usuario en la solicitud');
      return false;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.some(role => role === user.role);
    
    if (!hasRole) {
      this.logger.warn(`El usuario no tiene los roles requeridos. Rol actual: ${user.role}, Roles requeridos: ${JSON.stringify(requiredRoles)}`);
    }
    
    return hasRole;
  }
} 