import { Controller, Post, Body, Param, Get, Query, ParseUUIDPipe } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Pago } from './entities/pago.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @ApiOperation({ summary: 'Procesar un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago procesado exitosamente', type: Pago })
  procesarPago(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.procesarPago(createPagoDto);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar un pago existente' })
  @ApiResponse({ status: 200, description: 'Pago cancelado exitosamente', type: Pago })
  cancelarPago(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagosService.cancelarPago(id);
  }

  @Get('fecha')
  @ApiOperation({ summary: 'Obtener pagos por fecha' })
  @ApiResponse({ status: 200, description: 'Lista de pagos encontrados', type: [Pago] })
  async obtenerPagosPorFecha(@Query('fecha') fecha: string): Promise<Pago[]> {
    return this.pagosService.obtenerPagosPorFecha(new Date(fecha));
  }

  @Get('pedido/:id')
  @ApiOperation({ summary: 'Obtener pagos por pedido' })
  @ApiResponse({ status: 200, description: 'Lista de pagos encontrados', type: [Pago] })
  async obtenerPagosPorPedido(@Param('id', ParseUUIDPipe) pedidoId: string): Promise<Pago[]> {
    return this.pagosService.obtenerPagosPorPedido(pedidoId);
  }
} 