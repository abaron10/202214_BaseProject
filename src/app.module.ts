import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { CiudadSupermercadoModule } from './ciudad-supermercado/ciudad-supermercado.module';

@Module({
  imports: [CiudadModule, SupermercadoModule, CiudadSupermercadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
