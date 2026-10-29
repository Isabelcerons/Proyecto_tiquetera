import { Controller, Get } from '@nestjs/common';
import { EstadoService } from './estados.service';
import { Estado } from './entities/estado.entity';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }
} 