import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MesasModule } from './mesas/mesas.module';
import { TiqueterasModule } from './tiqueteras/tiqueteras.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PagosModule } from './pagos/pagos.module';
import { CommonModule } from './common/common.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { EstadosModule } from './estados/estados.module';

// Importaciones explícitas de entidades
import { User } from './users/entities/user.entity';
import { AuthUser } from './auth/entities/user.entity';
import { Mesa } from './mesas/entities/mesa.entity';
import { Categoria } from './categorias/entities/categoria.entity';
import { Producto } from './productos/entities/producto.entity';
import { Pedido } from './pedidos/entities/pedido.entity';
import { Tiquetera } from './tiqueteras/entities/tiquetera.entity';
import { MovimientoTiquetera } from './tiqueteras/entities/movimiento-tiquetera.entity';
import { Orden } from './ordenes/entities/orden.entity';
import { PedidoProducto } from './pedidos/entities/pedido-producto.entity';
import { Estado } from './estados/entities/estado.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'tiquetera'),
        entities: [
          User, Mesa, Categoria, Producto, Pedido, Tiquetera, MovimientoTiquetera, Orden, PedidoProducto, Estado
        ],
        synchronize: true,
      }),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    MesasModule,
    TiqueterasModule,
    PedidosModule,
    ProductosModule,
    CategoriasModule,
    PagosModule,
    OrdenesModule,
    EstadosModule,
  ],
})
export class AppModule {} 