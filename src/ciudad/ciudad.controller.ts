  import { plainToInstance } from 'class-transformer';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';
  import { CiudadEntity } from './ciudad.entity';
  import { CiudadService } from './ciudad.service';
  import {Controller,Get,Post,Delete,UseInterceptors,Param,Body,Put,HttpCode} from '@nestjs/common';
  import { CiudadDto } from './ciudad.dto';
  @Controller('cities')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class CiudadController {
    constructor(private readonly service: CiudadService) {}
     @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.service.findOne(id);
    }
    
    @Post()
    async create(@Body() responseDto: CiudadDto) {
      const city = plainToInstance(CiudadEntity, responseDto);
      return await this.service.create(city);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  

    @Put(':id')
    async update(@Param('id') id: string, @Body() entityDto: CiudadDto) {
      const city = plainToInstance(CiudadEntity, entityDto);
      city.id = id;
      return await this.service.update(city);
    }
  
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
      return await this.service.delete(id);
    }
  }