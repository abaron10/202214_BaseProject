import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find();
  }

  async findOne(idSupermercado: string): Promise<SupermercadoEntity> {
    const persistedSupermarket = await this.supermercadoRepository.findOne({ where: { id : `${idSupermercado}`}});

    if (!persistedSupermarket) {
        throw new BusinessLogicException(
            'The supermarket with the given id was not found',
            BusinessError.NOT_FOUND,
        );
    }

    return persistedSupermarket;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (supermercado.nombre.length < 10) {
      throw new BusinessLogicException(
        'Name too short for a supermarket. Please provide a valid one.',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.supermercadoRepository.save(supermercado);
  }

  async update(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    const persistedSupermarket = await this.supermercadoRepository.findOne({where: { id: `${supermercado.id}` }});

    if (!persistedSupermarket) {
      throw new BusinessLogicException(
        'Supermarket not found.',
        BusinessError.NOT_FOUND,
      );
    }

    if (supermercado.nombre.length < 10) {
      throw new BusinessLogicException(
        'Name too short for a supermarket. Please provide a valid one.',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.supermercadoRepository.save(supermercado);
  }

  async delete(idSupermercado: string) {
    const persistedSupermarket = await this.supermercadoRepository.findOne({where: { id :`${idSupermercado}` }});
    if (!persistedSupermarket) {
      throw new BusinessLogicException(
        'Supermarket not found.',
        BusinessError.NOT_FOUND,
      );
    }

    await this.supermercadoRepository.delete(persistedSupermarket);
  }
}