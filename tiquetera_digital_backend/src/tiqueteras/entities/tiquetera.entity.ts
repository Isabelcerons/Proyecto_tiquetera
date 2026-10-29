import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tiqueteras')
export class Tiquetera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'cliente_id' })
  cliente: User;

  @Column('uuid')
  cliente_id: string;

  @Column('integer', { name: 'saldo_inicial' })
  saldoInicial: number;

  @Column('integer', { name: 'saldo_disponible', default: 0 })
  saldoDisponible: number;

  @Column('integer', { name: 'total_asignado' })
  total_asignado: number;

  @Column('integer', { name: 'usados', default: 0 })
  usados: number;

  @Column('integer', { name: 'pendientes', default: 0 })
  pendientes: number;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @Column({ name: 'estado', default: 'activa' })
  estado: string;

  @Column({ name: 'fecha_vencimiento', nullable: true })
  fechaVencimiento: Date;

  @Column('decimal', { name: 'price', precision: 10, scale: 2, default: 225000 })
  price: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;
}
