// Este archivo define la entidad de usuario para el sistema - importante no renombrar esta clase
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

export enum UserRole {
  ADMIN = 'admin',
  CAJERO = 'cajero',
  MESERO = 'mesero',
  CLIENTE = 'cliente'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true, nullable: true })
  cedula: string;

  @Column({ unique: true, nullable: true })
  usuario: string;

  @Column({ nullable: true })
  pin: string;

  @Column()
  contrasena: string;

  // Alias para compatibilidad con el servicio de autenticación
  get username(): string {
    return this.usuario;
  }

  // Alias para compatibilidad con el servicio de autenticación
  get password(): string {
    return this.contrasena;
  }

  get role(): string {
    return this.rol;
  }

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role'
  })
  rol: UserRole;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 