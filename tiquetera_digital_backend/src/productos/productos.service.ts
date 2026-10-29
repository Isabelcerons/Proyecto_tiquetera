import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  create(createProductoDto: CreateProductoDto) {
    const producto = this.productosRepository.create(createProductoDto);
    return this.productosRepository.save(producto);
  }

  findAll() {
    return this.productosRepository.find({
      relations: ['categoria'],
      cache: true // Habilitar caché a nivel de TypeORM
    });
  }

  async findOne(id: string) {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria'],
      cache: true
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    this.productosRepository.merge(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    return this.productosRepository.remove(producto);
  }

  findByCategoria(categoriaId: string) {
    return this.productosRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'],
      cache: true
    });
  }
} 