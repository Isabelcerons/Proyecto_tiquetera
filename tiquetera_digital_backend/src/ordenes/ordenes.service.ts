import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden } from './entities/orden.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepository: Repository<Orden>,
  ) {}

  findAll(): Promise<Orden[]> {
    return this.ordenRepository.find();
  }

  // Aquí se pueden agregar más métodos para crear, actualizar, etc.
} 