
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  exports: [TypeOrmModule],
})
export class CiudadSupermercadoModule {}