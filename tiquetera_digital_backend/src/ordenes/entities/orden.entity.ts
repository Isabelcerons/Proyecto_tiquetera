import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Mesa } from '../../mesas/entities/mesa.entity';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mesa)
  mesa: Mesa;

  @Column()
  mesa_id: string;

  @ManyToOne(() => User)
  mesero: User;

  @Column()
  mesero_id: string;

  @Column({
    type: 'enum',
    enum: ['abierta', 'completa'],
    default: 'abierta'
  })
  estado: 'abierta' | 'completa';

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => Pedido, pedido => pedido.orden)
  pedidos: Pedido[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 