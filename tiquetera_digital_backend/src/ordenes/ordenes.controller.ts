import { Controller, Get } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { Orden } from './entities/orden.entity';

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Get()
  findAll(): Promise<Orden[]> {
    return this.ordenesService.findAll();
  }
} 