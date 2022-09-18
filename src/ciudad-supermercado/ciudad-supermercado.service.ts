import { Injectable } from '@nestjs/common';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,

  ) {}

  async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where: { id: `${ciudadId}` },relations: ['supermercados']});

    if (!persistedCity) {
        throw new BusinessLogicException(
            'The city with the given id was not found',
            BusinessError.NOT_FOUND,
          );
    }

    return persistedCity.supermercados;
  }

  async findSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<SupermercadoEntity> {
    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where: { id: `${ciudadId}` },relations: ['supermercados']});

    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const persistedSupermarket = persistedCity.supermercados.find((_supermercado) => _supermercado.id == supermercadoId);

    if (!persistedSupermarket) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return persistedSupermarket;
  }
  async addSupermarketToCity(ciudadId: string,supermercadoId: string): Promise<CiudadEntity> {
    const persistedSupermarket: SupermercadoEntity =await this.supermercadoRepository.findOne({where: { id: `${supermercadoId}` }});
    if (!persistedSupermarket) {
        throw new BusinessLogicException(
            'The supermarket with the given id was not found',
            BusinessError.NOT_FOUND,
        );
    }

    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where: { id: ciudadId }, relations: ['supermercados']});

    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!persistedCity.supermercados){
        persistedCity.supermercados = [];
    }

    persistedCity.supermercados = [...persistedCity.supermercados, persistedSupermarket];

    return await this.ciudadRepository.save(persistedCity);
  }


  async updateSupermarketsFromCity(ciudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where: { id: ciudadId }, relations: ['supermercados']});

    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    persistedCity.supermercados = [];
    for (var i = 0; i < supermercados.length; i++) {
      const persistedSupermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: { id: `${supermercados[i].id}` }});

      if (!persistedSupermarket) {
        throw new BusinessLogicException(
            'The supermarket with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
      persistedCity.supermercados = [...persistedCity.supermercados, persistedSupermarket];
    }
    return await this.ciudadRepository.save(persistedCity);
  }

  async deleteSupermarketFromCity(ciudadId: string,supermercadoId: string): Promise<CiudadEntity> {
    const persistedSupermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: { id: supermercadoId }});

    if (!persistedSupermarket) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const persistedCity: CiudadEntity = await this.ciudadRepository.findOne({where: { id: ciudadId },relations: ['supermercados']});

    if (!persistedCity) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (!persistedCity.supermercados) {
        persistedCity.supermercados = [];
    }

    const supermarketUsed = persistedCity.supermercados.find((_persistedSupermarket) => _persistedSupermarket.id == supermercadoId,);

    if (!supermarketUsed) {
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.BAD_REQUEST,
      );
    }

    persistedCity.supermercados = persistedCity.supermercados.filter((_supermercado) => _supermercado.id != persistedSupermarket.id);
    return await this.ciudadRepository.save(persistedCity);
  }
}