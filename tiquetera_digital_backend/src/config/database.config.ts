import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { User } from '../users/entities/user.entity';
import { Mesa } from '../mesas/entities/mesa.entity';
import { Tiquetera } from '../tiqueteras/entities/tiquetera.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Orden } from '../ordenes/entities/orden.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoProducto } from '../pedidos/entities/pedido-producto.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'tiquetera_prod',
  entities: [
    User,
    Mesa,
    Tiquetera,
    Categoria,
    Producto,
    Orden,
    Pedido,
    PedidoProducto
  ],
  autoLoadEntities: false,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production'
}; 