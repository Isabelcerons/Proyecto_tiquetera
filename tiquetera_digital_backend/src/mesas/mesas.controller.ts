import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('mesas')
@ApiBearerAuth()
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear una nueva mesa' })
  @ApiResponse({ status: 201, description: 'Mesa creada exitosamente' })
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mesas' })
  @ApiResponse({ status: 200, description: 'Lista de mesas' })
  findAll() {
    return this.mesasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mesa por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mesa' })
  @ApiResponse({ status: 200, description: 'Mesa encontrada' })
  @ApiResponse({ status: 404, description: 'Mesa no encontrada' })
  findOne(@Param('id') id: string) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar una mesa' })
  @ApiParam({ name: 'id', description: 'ID de la mesa' })
  @ApiResponse({ status: 200, description: 'Mesa actualizada' })
  update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar una mesa' })
  @ApiParam({ name: 'id', description: 'ID de la mesa' })
  @ApiResponse({ status: 200, description: 'Mesa eliminada' })
  remove(@Param('id') id: string) {
    return this.mesasService.remove(id);
  }
} 