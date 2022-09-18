  import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseInterceptors,} from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { SupermercadoDto } from '../supermercado/supermercado.dto';
  import { SupermercadoEntity } from '../supermercado/supermercado.entity';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';
  import { CiudadSupermercadoService } from './ciudad-supermercado.service';
  
  @Controller('cities')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class CiudadSupermercadoController {
    constructor(private readonly service: CiudadSupermercadoService) {}
  
    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
      return await this.service.addSupermarketToCity(ciudadId, supermercadoId);
    }
  
    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
      return await this.service.findSupermarketsFromCity(ciudadId);
    }
   
    @Put(':ciudadId/supermarkets')
    async updateSupermarketsFromCity(@Param('ciudadId') ciudadId: string,@Body() responseDto: SupermercadoDto[]) {
      const supermarkets: SupermercadoEntity[] = plainToInstance(SupermercadoEntity, responseDto);
      return await this.service.updateSupermarketsFromCity(ciudadId, supermarkets);
    }
   
    @Get(':ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('supermercadoId') supermercadoId: string, @Param('ciudadId') ciudadId: string) {
      return await this.service.findSupermarketFromCity(ciudadId, supermercadoId);
    }
  
    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('supermercadoId') supermercadoId: string,@Param('ciudadId') ciudadId: string,) {
      return await this.service.deleteSupermarketFromCity(supermercadoId,ciudadId);
    }
  }