import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Tiquetera } from './tiquetera.entity';

export enum TipoMovimiento {
  CARGA = 'carga',
  CONSUMO = 'consumo',
  AJUSTE = 'ajuste'
}

@Entity('movimientos_tiquetera')
export class MovimientoTiquetera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tiquetera, tiquetera => tiquetera.id)
  @JoinColumn()
  tiquetera: Tiquetera;

  @Column({ nullable: true })
  tiquetera_id: string;

  @Column({
    type: 'enum',
    enum: TipoMovimiento,
    enumName: 'tipo_movimiento',
    nullable: true
  })
  tipo: TipoMovimiento;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monto: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  saldoAnterior: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  saldoNuevo: number;

  @Column({ nullable: true })
  pedido_id: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  usuario_id: string;
  
  @Column({ nullable: true })
  referencia: string;
  
  @CreateDateColumn()
  fecha: Date;
} 