import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { Mesa } from './entities/mesa.entity';
import { Estado } from '../estados/entities/estado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa, Estado])],
  controllers: [MesasController],
  providers: [MesasService],
  exports: [MesasService]
})
export class MesasModule {} 