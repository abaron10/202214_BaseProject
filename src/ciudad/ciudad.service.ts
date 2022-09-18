
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
    paisesValidosCiudad = ['Ecuador', 'Paraguay','Argentina'];
    notValidCountry = 'The given country is not valid. Please provide a valid one.';
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find();
  }

  async findOne(idCity: string): Promise<CiudadEntity> {
    const ciudad = await this.ciudadRepository.findOne({ where: { id: `${idCity}` }});

    if (!ciudad) {
        throw new BusinessLogicException(
            'The city with the given id was not found',
            BusinessError.NOT_FOUND,
        );
    }

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.paisesValidosCiudad.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        this.notValidCountry,
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async update(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.paisesValidosCiudad.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        this.notValidCountry,
        BusinessError.BAD_REQUEST,
      );
    }

    const persistedCity = await this.ciudadRepository.findOne({where: { id: `${ciudad.id}` }});

    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async delete(idCiudad: string) {
    const persistedCity = await this.ciudadRepository.findOne({where: { id : `${idCiudad}` },});
    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    await this.ciudadRepository.delete(persistedCity);
  }

}
