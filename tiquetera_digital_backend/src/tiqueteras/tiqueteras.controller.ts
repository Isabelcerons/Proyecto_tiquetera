import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TiqueterasService } from './tiqueteras.service';
import { CreateTiqueteraDto } from './dto/create-tiquetera.dto';
import { UpdateTiqueteraDto } from './dto/update-tiquetera.dto';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tiqueteras')
@ApiBearerAuth()
@Controller('tiqueteras')
export class TiqueterasController {
  constructor(private readonly tiqueterasService: TiqueterasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear una nueva tiquetera' })
  @ApiResponse({ status: 201, description: 'Tiquetera creada exitosamente' })
  create(@Body() createTiqueteraDto: CreateTiqueteraDto) {
    return this.tiqueterasService.create(createTiqueteraDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  @ApiOperation({ summary: 'Obtener todas las tiqueteras' })
  @ApiResponse({ status: 200, description: 'Lista de tiqueteras' })
  findAll() {
    return this.tiqueterasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una tiquetera por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Tiquetera encontrada' })
  @ApiResponse({ status: 404, description: 'Tiquetera no encontrada' })
  findOne(@Param('id') id: string) {
    return this.tiqueterasService.findOne(id);
  }

  @Get('cliente/:clienteId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener tiqueteras de un cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de tiqueteras del cliente' })
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.tiqueterasService.findByCliente(clienteId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar una tiquetera' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Tiquetera actualizada' })
  update(@Param('id') id: string, @Body() updateTiqueteraDto: UpdateTiqueteraDto) {
    return this.tiqueterasService.update(id, updateTiqueteraDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Desactivar una tiquetera' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Tiquetera desactivada' })
  remove(@Param('id') id: string) {
    return this.tiqueterasService.remove(id);
  }

  @Post(':id/cargar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  @ApiOperation({ summary: 'Cargar saldo a una tiquetera' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Tiquetera recargada' })
  cargarSaldo(
    @Param('id') id: string, 
    @Body() createMovimientoDto: CreateMovimientoDto
  ) {
    return this.tiqueterasService.cargarSaldo(
      id, 
      createMovimientoDto.monto, 
      createMovimientoDto.usuario_id || 'system', 
      createMovimientoDto.descripcion
    );
  }

  @Post(':id/consumir')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  @ApiOperation({ summary: 'Registrar consumo en una tiquetera' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Consumo registrado' })
  @ApiResponse({ status: 400, description: 'Error al registrar consumo' })
  registrarConsumo(
    @Param('id') id: string, 
    @Body() createMovimientoDto: CreateMovimientoDto
  ) {
    return this.tiqueterasService.consumirSaldo(
      id,
      createMovimientoDto.monto,
      createMovimientoDto.usuario_id || 'system',
      createMovimientoDto.pedido_id,
      createMovimientoDto.descripcion
    );
  }

  @Get(':id/movimientos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener historial de movimientos de una tiquetera' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Historial de movimientos' })
  getMovimientos(@Param('id') id: string) {
    return this.tiqueterasService.getMovimientos(id);
  }

  @Post(':id/validar-consumo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Validar si una tiquetera puede cubrir un consumo' })
  @ApiParam({ name: 'id', description: 'ID de la tiquetera' })
  @ApiResponse({ status: 200, description: 'Resultado de la validación' })
  validarConsumo(
    @Param('id') id: string,
    @Body('monto') monto: number
  ) {
    return this.tiqueterasService.validarConsumo(id, monto);
  }
} 