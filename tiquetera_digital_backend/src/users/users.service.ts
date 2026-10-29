import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creando usuario: ${JSON.stringify(createUserDto)}`);
    // Validar que el nombre de usuario sea único
    const existing = await this.usersRepository.findOne({ where: { usuario: createUserDto.usuario } });
    if (existing) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }
    const hash = await bcrypt.hash(createUserDto.contrasena, 10);
    const user = this.usersRepository.create({
      nombre: createUserDto.nombre,
      usuario: createUserDto.usuario,
      contrasena: hash,
      rol: UserRole.CLIENTE,
      cedula: createUserDto.cedula || null,
      pin: createUserDto.pin || null,
      activo: true
    });
    this.logger.log(`Objeto usuario a guardar: ${JSON.stringify(user)}`);
    return this.usersRepository.save(user);
  }

  // Método para convertir string a enum UserRole
  private getRoleEnum(role: string): UserRole {
    if (!role) return UserRole.CLIENTE;
    
    switch(role.toLowerCase()) {
      case 'admin': return UserRole.ADMIN;
      case 'cajero': return UserRole.CAJERO;
      case 'mesero': return UserRole.MESERO;
      case 'cliente':
      default: return UserRole.CLIENTE;
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByUsername(username: string) {
    this.logger.log(`Buscando usuario por nombre de usuario: ${username}`);
    const user = await this.usersRepository.findOne({ where: { usuario: username } });
    if (user) {
      this.logger.log(`Usuario encontrado: ${JSON.stringify(user)}`);
    } else {
      this.logger.error(`Usuario no encontrado: ${username}`);
    }
    return user;
  }

  async findByCedula(cedula: string) {
    this.logger.log(`Buscando usuario por cédula: ${cedula}`);
    const user = await this.usersRepository.findOne({ where: { cedula } });
    if (user) {
      this.logger.log(`Usuario encontrado: ${JSON.stringify(user)}`);
    } else {
      this.logger.error(`Usuario no encontrado con cédula: ${cedula}`);
    }
    return user;
  }

  async searchByName(name: string) {
    this.logger.log(`Buscando usuarios que coincidan con el nombre: ${name}`);
    const users = await this.usersRepository.find({
      where: {
        nombre: ILike(`%${name}%`)
      }
    });
    this.logger.log(`Se encontraron ${users.length} usuarios que coinciden con la búsqueda`);
    return users;
  }

  async findByRole(role: string) {
    this.logger.log(`Buscando usuarios con rol: ${role}`);
    const rolEnum = this.getRoleEnum(role);
    const users = await this.usersRepository.find({
      where: {
        rol: rolEnum,
        activo: true
      }
    });
    this.logger.log(`Se encontraron ${users.length} usuarios con el rol ${role}`);
    return users;
  }

  async findByNombre(nombre: string) {
    this.logger.log(`Buscando usuario por nombre: ${nombre}`);
    const user = await this.usersRepository.findOne({ where: { nombre: ILike(nombre) } });
    if (user) {
      this.logger.log(`Usuario encontrado: ${JSON.stringify(user)}`);
    } else {
      this.logger.error(`Usuario no encontrado con nombre: ${nombre}`);
    }
    return user;
  }

  async findByPin(pin: string) {
    this.logger.log(`Buscando usuario por PIN: ${pin}`);
    const user = await this.usersRepository.findOne({ where: { pin } });
    if (user) {
      this.logger.log(`Usuario encontrado: ${JSON.stringify(user)}`);
    } else {
      this.logger.error(`Usuario no encontrado con PIN: ${pin}`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Actualizando usuario ${id} con datos: ${JSON.stringify(updateUserDto)}`);
    
    // Primero buscamos el usuario para asegurarnos que existe
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Preparamos el objeto de actualización
    const updateData: Partial<User> = {};
    
    // Si hay una nueva contraseña, la hasheamos
    if (updateUserDto.password) {
      updateData.contrasena = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Si hay un nuevo rol, lo convertimos
    if (updateUserDto.role) {
      updateData.rol = this.getRoleEnum(updateUserDto.role);
    }
    
    // Si isActive está definido, actualizamos activo
    if (updateUserDto.isActive !== undefined) {
      updateData.activo = updateUserDto.isActive;
    }
    
    // Si hay nueva cédula o pin, los actualizamos
    if (updateUserDto.cedula !== undefined) {
      updateData.cedula = updateUserDto.cedula;
    }
    
    if (updateUserDto.pin !== undefined) {
      updateData.pin = updateUserDto.pin;
    }
    
    this.logger.log(`Datos a actualizar: ${JSON.stringify(updateData)}`);
    
    // Realizamos la actualización
    if (Object.keys(updateData).length > 0) {
      await this.usersRepository.update(id, updateData);
    }
    
    // Devolvemos el usuario actualizado
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
} 