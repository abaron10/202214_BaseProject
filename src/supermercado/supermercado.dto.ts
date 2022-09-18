import {IsNotEmpty,IsNumber,IsOptional,IsString,IsUrl} from 'class-validator';
  
  export class SupermercadoDto {
    @IsOptional()
    id: string;
  
    @IsNumber()
    latitud: number;

    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsNumber()
    longitud: number;
  
  }