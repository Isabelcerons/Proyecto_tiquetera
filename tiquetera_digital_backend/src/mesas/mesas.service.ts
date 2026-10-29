import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Estado } from '../estados/entities/estado.entity';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createMesaDto: CreateMesaDto): Promise<Mesa> {
    const { estado: estadoId, ...rest } = createMesaDto;

    const estado = await this.estadoRepository.findOne({ where: { id: estadoId } });
    if (!estado) {
      throw new NotFoundException(`Estado con ID "${estadoId}" no encontrado`);
    }

    const nuevaMesa = this.mesaRepository.create({
      ...rest,
      estadoId: estado.id,
    });

    return this.mesaRepository.save(nuevaMesa);
  }

  async findAll() {
    return this.mesaRepository.find({
      order: { numero: 'ASC' },
      cache: true
    });
  }

  async findOne(id: string) {
    const mesa = await this.mesaRepository.findOne({
      where: { id },
      relations: ['ordenes'],
      cache: true
    });
    
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }
    
    return mesa;
  }

  async update(id: string, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    const { estado: estadoId, ...rest } = updateMesaDto;
    const mesa = await this.mesaRepository.preload({
      id,
      ...rest,
    });

    if (!mesa) {
      throw new NotFoundException(`Mesa con ID "${id}" no encontrada`);
    }

    if (estadoId) {
      const estado = await this.estadoRepository.findOne({ where: { id: estadoId } });
      if (!estado) {
        throw new NotFoundException(`Estado con ID "${estadoId}" no encontrado`);
      }
      mesa.estadoId = estado.id;
    }

    return this.mesaRepository.save(mesa);
  }

  async remove(id: string): Promise<void> {
    const result = await this.mesaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mesa con ID "${id}" no encontrada`);
    }
  }
} 