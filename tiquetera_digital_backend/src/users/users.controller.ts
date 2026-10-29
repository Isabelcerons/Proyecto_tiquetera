import { Controller, Post, Body, Get, Param, UseGuards, Put, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    schema: {
      example: {
        username: 'nuevo_usuario',
        password: 'una_contraseña_segura',
        role: 'admin' // o 'cajero', 'mesero', 'cliente'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero', 'mesero')
  @Get('search')
  @ApiOperation({ summary: 'Buscar usuarios por nombre' })
  @ApiQuery({ name: 'name', description: 'Nombre o parte del nombre a buscar', required: true })
  @ApiResponse({ status: 200, description: 'Lista de usuarios que coinciden con la búsqueda.' })
  search(@Query('name') name: string) {
    return this.usersService.searchByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero', 'mesero')
  @Get('role/:role')
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiParam({ name: 'role', description: 'Rol de usuario (admin, cajero, mesero, cliente)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios con el rol especificado.' })
  findByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search-by-pin')
  @ApiOperation({ summary: 'Buscar usuario por PIN' })
  @ApiQuery({ name: 'pin', description: 'PIN exacto del cliente', required: true })
  async searchByPin(@Query('pin') pin: string) {
    const user = await this.usersService.findByPin(pin);
    if (user) {
      return { resultado: `${user.pin} ${user.nombre}` };
    } else {
      return { mensaje: 'No se encontró usuario con ese PIN' };
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    schema: {
      example: {
        password: 'nueva_contraseña_opcional',
        role: 'cajero',
        isActive: true
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Public()
  @Get('exists/usuario/:usuario')
  async checkUsernameExists(@Param('usuario') usuario: string) {
    const user = await this.usersService.findByUsername(usuario);
    return { exists: !!user };
  }

  @Public()
  @Get('exists/nombre/:nombre')
  async checkNombreExists(@Param('nombre') nombre: string) {
    const user = await this.usersService.findByNombre(nombre);
    return { exists: !!user };
  }

  @Public()
  @Get('exists/pin/:pin')
  async checkPinExists(@Param('pin') pin: string) {
    const user = await this.usersService.findByPin(pin);
    return { exists: !!user };
  }

  @Public()
  @Get('find-by-pin/:pin')
  async findByPin(@Param('pin') pin: string) {
    const user = await this.usersService.findByPin(pin);
    return user || null;
  }
} 