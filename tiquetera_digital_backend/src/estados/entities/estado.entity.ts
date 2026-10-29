import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Mesa } from '../../mesas/entities/mesa.entity';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Mesa, mesa => mesa.estado)
  mesas: Mesa[];
} 