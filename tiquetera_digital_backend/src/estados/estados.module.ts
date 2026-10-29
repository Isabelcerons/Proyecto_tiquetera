import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';
import { EstadoService } from './estados.service';
import { EstadosController } from './estados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  providers: [EstadoService],
  controllers: [EstadosController],
  exports: [EstadoService],
})
export class EstadosModule {} 