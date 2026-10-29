import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { PedidoProducto } from '../../pedidos/entities/pedido-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  categoria: Categoria;

  @Column({ default: true })
  disponible: boolean;

  // Comentamos esta relación para evitar errores
  // @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.producto)
  // pedidoProductos: PedidoProducto[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 