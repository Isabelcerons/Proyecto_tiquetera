import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiqueterasService } from './tiqueteras.service';
import { TiqueterasController } from './tiqueteras.controller';
import { Tiquetera } from './entities/tiquetera.entity';
import { MovimientoTiquetera } from './entities/movimiento-tiquetera.entity';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tiquetera, MovimientoTiquetera]),
    UsersModule,
    CommonModule
  ],
  controllers: [TiqueterasController],
  providers: [TiqueterasService],
  exports: [TiqueterasService]
})
export class TiqueterasModule {} 