
  import { plainToInstance } from 'class-transformer';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';
  import { SupermercadoDto } from './supermercado.dto';
  import { SupermercadoEntity } from './supermercado.entity';
  import { SupermercadoService } from './supermercado.service';
  import {Controller,Get,Post,Delete,UseInterceptors,Param,Body,Put,HttpCode} from '@nestjs/common'; 


  @Controller('supermarkets')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class SupermercadoController {
    constructor(private readonly service: SupermercadoService) {}
    
        @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.service.findOne(id);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }

    @Post()
    async create(@Body() responseDto: SupermercadoDto) {
      const supermarket = plainToInstance(SupermercadoEntity, responseDto);
      return await this.service.create(supermarket);
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() responseDto: SupermercadoDto) {
      const supermarket = plainToInstance(SupermercadoEntity, responseDto);
      supermarket.id = id;
      return await this.service.update(supermarket);
    }
  
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
      return await this.service.delete(id);
    }
  }