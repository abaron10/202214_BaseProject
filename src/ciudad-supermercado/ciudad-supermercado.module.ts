import { Module } from '@nestjs/common';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  exports: [TypeOrmModule],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}