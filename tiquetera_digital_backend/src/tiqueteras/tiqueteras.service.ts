import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tiquetera } from './entities/tiquetera.entity';
import { MovimientoTiquetera, TipoMovimiento } from './entities/movimiento-tiquetera.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateTiqueteraDto } from './dto/create-tiquetera.dto';
import { UpdateTiqueteraDto } from './dto/update-tiquetera.dto';

@Injectable()
export class TiqueterasService {
  constructor(
    @InjectRepository(Tiquetera)
    private readonly tiqueteraRepository: Repository<Tiquetera>,
    @InjectRepository(MovimientoTiquetera)
    private readonly movimientoRepository: Repository<MovimientoTiquetera>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Tiquetera[]> {
    return this.tiqueteraRepository.find({
      relations: ['cliente'],
    });
  }

  async findOne(id: string): Promise<Tiquetera> {
    const tiquetera = await this.tiqueteraRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });
    
    if (!tiquetera) {
      throw new NotFoundException(`Tiquetera con ID ${id} no encontrada`);
    }
    
    return tiquetera;
  }

  async findByCliente(clienteId: string): Promise<Tiquetera[]> {
    return this.tiqueteraRepository.find({
      where: { cliente_id: clienteId },
      relations: ['cliente'],
    });
  }

  async create(createTiqueteraDto: CreateTiqueteraDto): Promise<Tiquetera> {
    try {
      console.log('Iniciando creación de tiquetera:', JSON.stringify(createTiqueteraDto, null, 2));
      
      // Buscar cliente por ID
      const cliente = await this.userRepository.findOne({ where: { id: createTiqueteraDto.cliente_id } });
      if (!cliente) {
        throw new NotFoundException(`Usuario con id ${createTiqueteraDto.cliente_id} no encontrado`);
      }
      console.log('Cliente encontrado:', cliente.id, cliente.nombre);
      
      // Validar saldoInicial
      const saldoInicial = createTiqueteraDto.saldoInicial || 30;
      if (saldoInicial <= 0) {
        throw new BadRequestException('El saldo inicial debe ser un número positivo');
      }

      // Validar price
      const price = createTiqueteraDto.price || 225000;
      if (price <= 0) {
        throw new BadRequestException('El precio debe ser un número positivo');
      }

      // Procesar fecha de vencimiento si existe
      let fechaVencimiento = null;
      if (createTiqueteraDto.fechaVencimiento) {
        try {
          fechaVencimiento = new Date(createTiqueteraDto.fechaVencimiento);
          console.log('Fecha de vencimiento procesada:', fechaVencimiento);
        } catch (e) {
          console.error('Error al procesar fecha de vencimiento:', e);
          throw new BadRequestException('Formato de fecha inválido');
        }
      }
      
      // Crear el objeto tiquetera con nombres de campos correctos para la base de datos
      const datos = {
        cliente_id: cliente.id,
        saldo_inicial: saldoInicial,
        saldo_disponible: saldoInicial,
        total_asignado: saldoInicial,
        usados: 0,
        pendientes: 0,
        activo: createTiqueteraDto.activa ?? true,
        estado: createTiqueteraDto.activa === false ? 'inactiva' : 'activa',
        price: price,
        fecha_vencimiento: fechaVencimiento
      };
      
      console.log('Datos a insertar en la base de datos:', datos);
      
      // Guardar en la base de datos usando consulta SQL directa
      try {
        // Inserción directa en la base de datos
        const queryRunner = this.tiqueteraRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
          const insertResult = await queryRunner.manager.query(
            `INSERT INTO tiqueteras(cliente_id, saldo_inicial, saldo_disponible, total_asignado, usados, pendientes, activo, estado, price, fecha_vencimiento)
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, 
            [
              datos.cliente_id, 
              datos.saldo_inicial, 
              datos.saldo_disponible, 
              datos.total_asignado,
              datos.usados,
              datos.pendientes,
              datos.activo,
              datos.estado,
              datos.price,
              datos.fecha_vencimiento
            ]
          );
          
          console.log('Resultado de la inserción:', insertResult);
          const tiqueteraId = insertResult[0].id;
          
          // Crear movimiento inicial
          await queryRunner.manager.query(
            `INSERT INTO movimientos_tiquetera(tiquetera_id, monto, tipo, usuario_id, descripcion, saldo_anterior, saldo_nuevo)
             VALUES($1, $2, $3, $4, $5, $6, $7)`,
            [
              tiqueteraId,
              saldoInicial,
              TipoMovimiento.CARGA,
              null,
              'Carga inicial de tiquetera',
              0,
              saldoInicial
            ]
          );
          
          await queryRunner.commitTransaction();
          
          // Consultar la tiquetera completa
          return this.findOne(tiqueteraId);
        } catch (error) {
          console.error('Error en transacción SQL:', error);
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
      } catch (dbError) {
        console.error('Error de base de datos:', dbError);
        throw new Error(`Error de base de datos: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Error en la creación de tiquetera:', error);
      // Relanzar errores de negocio específicos
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Para cualquier otro error, lanzar un error más genérico
      throw new Error(`Error al crear tiquetera: ${error.message}`);
    }
  }

  async update(id: string, updateTiqueteraDto: UpdateTiqueteraDto): Promise<Tiquetera> {
    const tiquetera = await this.findOne(id);
    
    // Actualizar propiedades
    Object.assign(tiquetera, updateTiqueteraDto);
    
    return this.tiqueteraRepository.save(tiquetera);
  }

  async cambiarEstado(id: string, estado: string): Promise<Tiquetera> {
    const tiquetera = await this.findOne(id);
    
    if (!['activa', 'vencida', 'agotada', 'cancelada'].includes(estado)) {
      throw new BadRequestException('Estado no válido');
    }
    
    tiquetera.estado = estado;
    
    // Si se cancela, se inactiva
    if (estado === 'cancelada') {
      tiquetera.activo = false;
    }
    
    return this.tiqueteraRepository.save(tiquetera);
  }

  async cargarSaldo(
    id: string, 
    monto: number, 
    usuarioId: string, 
    descripcion?: string
  ): Promise<Tiquetera> {
    const tiquetera = await this.findOne(id);
    
    if (tiquetera.estado !== 'activa') {
      throw new BadRequestException('No se puede cargar saldo a una tiquetera no activa');
    }
    
    if (monto <= 0) {
      throw new BadRequestException('El monto debe ser positivo');
    }
    
    // Crear movimiento
    const movimiento = this.movimientoRepository.create({
      tiquetera,
      monto,
      tipo: TipoMovimiento.CARGA,
      usuario_id: usuarioId,
      descripcion,
      saldoAnterior: tiquetera.saldoDisponible,
      saldoNuevo: tiquetera.saldoDisponible + monto
    });
    
    // Actualizar saldo
    tiquetera.saldoDisponible += monto;
    tiquetera.total_asignado += monto;
    
    // Guardar todo
    await this.movimientoRepository.save(movimiento);
    return this.tiqueteraRepository.save(tiquetera);
  }

  async consumirSaldo(
    id: string, 
    monto: number, 
    usuarioId: string, 
    ordenId?: string, 
    descripcion?: string
  ): Promise<Tiquetera> {
    const tiquetera = await this.findOne(id);
    
    if (tiquetera.estado !== 'activa') {
      throw new BadRequestException('No se puede consumir saldo de una tiquetera no activa');
    }
    
    if (monto <= 0) {
      throw new BadRequestException('El monto debe ser positivo');
    }
    
    if (tiquetera.saldoDisponible < monto) {
      throw new BadRequestException('Saldo insuficiente');
    }
    
    // Crear movimiento
    const movimiento = this.movimientoRepository.create({
      tiquetera,
      monto: -monto, // Monto negativo para consumo
      tipo: TipoMovimiento.CONSUMO,
      usuario_id: usuarioId,
      pedido_id: ordenId,
      descripcion,
      saldoAnterior: tiquetera.saldoDisponible,
      saldoNuevo: tiquetera.saldoDisponible - monto
    });
    
    // Actualizar saldo
    tiquetera.saldoDisponible -= monto;
    tiquetera.usados += monto;
    
    // Verificar si se agotó el saldo
    if (tiquetera.saldoDisponible === 0) {
      tiquetera.estado = 'agotada';
    }
    
    // Guardar todo
    await this.movimientoRepository.save(movimiento);
    return this.tiqueteraRepository.save(tiquetera);
  }

  async getMovimientos(id: string): Promise<MovimientoTiquetera[]> {
    const tiquetera = await this.findOne(id);
    
    return this.movimientoRepository.find({
      where: { tiquetera: { id: tiquetera.id } },
      order: { fecha: 'DESC' },
    });
  }

  async validarConsumo(id: string, monto: number): Promise<{ valido: boolean; mensaje: string; saldoDisponible: number }> {
    const tiquetera = await this.findOne(id);
    
    if (tiquetera.estado !== 'activa') {
      return {
        valido: false,
        mensaje: 'La tiquetera no está activa',
        saldoDisponible: tiquetera.saldoDisponible
      };
    }
    
    if (monto <= 0) {
      return {
        valido: false,
        mensaje: 'El monto debe ser positivo',
        saldoDisponible: tiquetera.saldoDisponible
      };
    }
    
    if (tiquetera.saldoDisponible < monto) {
      return {
        valido: false,
        mensaje: `Saldo insuficiente. Disponible: ${tiquetera.saldoDisponible} tickets`,
        saldoDisponible: tiquetera.saldoDisponible
      };
    }
    
    return {
      valido: true,
      mensaje: 'La tiquetera puede cubrir este consumo',
      saldoDisponible: tiquetera.saldoDisponible
    };
  }

  async remove(id: string): Promise<void> {
    const tiquetera = await this.findOne(id);
    await this.tiqueteraRepository.remove(tiquetera);
  }
}
