import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido-producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    @InjectRepository(PedidoProducto)
    private pedidoProductosRepository: Repository<PedidoProducto>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const pedido = this.pedidosRepository.create(createPedidoDto);
    const savedPedido = await this.pedidosRepository.save(pedido);

    if (createPedidoDto.productos) {
      const pedidoProductos = createPedidoDto.productos.map(producto => ({
        ...producto,
        pedido: savedPedido
      }));
      await this.pedidoProductosRepository.save(pedidoProductos);
    }

    return this.findOne(savedPedido.id);
  }

  async findAll() {
    return this.pedidosRepository.find({
      relations: ['cliente', 'orden', 'pedidoProductos', 'pedidoProductos.producto'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: string) {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: ['cliente', 'orden', 'pedidoProductos', 'pedidoProductos.producto']
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async findByOrden(ordenId: string) {
    return this.pedidosRepository.find({
      where: { orden: { id: ordenId } },
      relations: ['cliente', 'pedidoProductos', 'pedidoProductos.producto'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findByCliente(clienteId: string) {
    return this.pedidosRepository.find({
      where: { cliente: { id: clienteId } },
      relations: ['orden', 'pedidoProductos', 'pedidoProductos.producto'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);
    
    // Actualizar pedido
    this.pedidosRepository.merge(pedido, updatePedidoDto);
    const updatedPedido = await this.pedidosRepository.save(pedido);

    // Actualizar productos si se proporcionan
    if (updatePedidoDto.productos) {
      // Eliminar productos existentes
      await this.pedidoProductosRepository.delete({ pedido: { id } });

      // Crear nuevos productos
      const pedidoProductos = updatePedidoDto.productos.map(producto => ({
        ...producto,
        pedido: updatedPedido
      }));
      await this.pedidoProductosRepository.save(pedidoProductos);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const pedido = await this.findOne(id);
    
    // Eliminar productos primero
    await this.pedidoProductosRepository.delete({ pedido: { id } });
    
    // Eliminar pedido
    return this.pedidosRepository.remove(pedido);
  }
} 