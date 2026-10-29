import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';
import { Tiquetera } from '../../tiqueteras/entities/tiquetera.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pedido, { eager: true })
  pedido: Pedido;

  @Column('uuid')
  pedido_id: string;

  @Column({
    type: 'enum',
    enum: ['tiquetera', 'efectivo'],
  })
  metodo_pago: 'tiquetera' | 'efectivo';

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monto_efectivo: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  vuelto: number;

  @ManyToOne(() => Tiquetera, { nullable: true, eager: true })
  tiquetera: Tiquetera;

  @Column({ type: 'uuid', nullable: true })
  tiquetera_id: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'pendiente'
  })
  estado: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'pagado'],
    default: 'pendiente'
  })
  estado_pago: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fecha_actualizacion: Date;
} 