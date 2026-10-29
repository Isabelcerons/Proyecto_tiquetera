import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos obtenida exitosamente' })
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Get('orden/:ordenId')
  @ApiOperation({ summary: 'Obtener pedidos por orden' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos de la orden obtenida exitosamente' })
  findByOrden(@Param('ordenId') ordenId: string) {
    return this.pedidosService.findByOrden(ordenId);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Obtener pedidos por cliente' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos del cliente obtenida exitosamente' })
  findByCliente(@Param('clienteId') clienteId: string) {
    return this.pedidosService.findByCliente(clienteId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pedido' })
  @ApiResponse({ status: 200, description: 'Pedido actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiResponse({ status: 200, description: 'Pedido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(id);
  }
} 