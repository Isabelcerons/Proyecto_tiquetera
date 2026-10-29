import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Tiquetera } from '../tiqueteras/entities/tiquetera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Pedido, Tiquetera])
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService]
})
export class PagosModule {} 