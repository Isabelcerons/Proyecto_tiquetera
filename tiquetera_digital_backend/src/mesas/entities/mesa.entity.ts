import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Orden } from '../../ordenes/entities/orden.entity';
import { User } from '../../users/entities/user.entity';
import { Estado } from '../../estados/entities/estado.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', unique: true })
  numero: number;

  @Column({ type: 'integer', default: 4 })
  capacidad: number;

  @Column({ type: 'varchar', length: 100, default: 'General' })
  zona: string;

  @ManyToOne(() => Estado, estado => estado.mesas, { eager: true, nullable: false })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @Column({ name: 'estado_id', nullable: false, default: 1 })
  estadoId: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'mesero_id' })
  mesero: User;

  @OneToMany(() => Orden, orden => orden.mesa)
  ordenes: Orden[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
} 