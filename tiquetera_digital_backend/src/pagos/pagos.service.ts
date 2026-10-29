import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Tiquetera } from '../tiqueteras/entities/tiquetera.entity';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Tiquetera)
    private readonly tiqueteraRepository: Repository<Tiquetera>,
    private dataSource: DataSource
  ) {}

  async procesarPago(datosPago: CreatePagoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { id: datosPago.pedido_id },
        relations: ['cliente'],
      });

      if (!pedido) {
        throw new BadRequestException('Pedido no encontrado');
      }

      if (pedido.estado_pago === 'pagado') {
        throw new BadRequestException('El pedido ya está pagado');
      }

      const pago = this.pagoRepository.create({
        ...datosPago,
        pedido,
      });

      if (datosPago.metodo_pago === 'tiquetera' && datosPago.tiquetera_id) {
        const tiquetera = await this.tiqueteraRepository.findOne({
          where: { id: datosPago.tiquetera_id },
        });

        if (!tiquetera) {
          throw new BadRequestException('Tiquetera no encontrada');
        }

        pago.tiquetera = tiquetera;
      }

      await queryRunner.manager.save(pago);
      pedido.estado_pago = 'pagado';
      await queryRunner.manager.save(pedido);

      await queryRunner.commitTransaction();
      return pago;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelarPago(id: string) {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: ['pedido'],
    });

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      pago.estado = 'cancelado';
      if (pago.pedido) {
        pago.pedido.estado_pago = 'pendiente';
        await queryRunner.manager.save(pago.pedido);
      }
      
      const pagoActualizado = await queryRunner.manager.save(pago);
      await queryRunner.commitTransaction();
      return pagoActualizado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerPagosPorFecha(fecha: Date) {
    return this.pagoRepository.find({
      where: {
        fecha_creacion: fecha,
      },
      relations: ['pedido', 'tiquetera'],
    });
  }

  async obtenerPagosPorPedido(pedidoId: string) {
    return this.pagoRepository.find({
      where: {
        pedido: { id: pedidoId },
      },
      relations: ['pedido', 'tiquetera'],
    });
  }
} 