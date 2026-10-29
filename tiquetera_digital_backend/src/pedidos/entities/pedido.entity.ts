import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Orden } from '../../ordenes/entities/orden.entity';
import { PedidoProducto } from './pedido-producto.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Orden, orden => orden.pedidos)
  orden: Orden;

  @Column()
  orden_id: string;

  @ManyToOne(() => User, user => user.pedidos)
  cliente: User;

  @Column()
  cliente_id: string;

  @Column({
    type: 'enum',
    enum: ['tiquetera', 'efectivo'],
  })
  metodo_pago: 'tiquetera' | 'efectivo';

  @Column({
    type: 'enum',
    enum: ['pagado', 'pendiente'],
    default: 'pendiente'
  })
  estado_pago: 'pagado' | 'pendiente';

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.pedido)
  productos: PedidoProducto[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 