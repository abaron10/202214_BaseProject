import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermarketList: SupermercadoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        id: faker.database.mongodbObjectId(),
        nombre: faker.datatype.string(11),
        latitud: parseFloat(faker.address.latitude()),
        longitud: parseFloat(faker.address.longitude()),
        url: faker.internet.url(),
      });
      supermarketList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('FindOne', async () => {
    const supermarket = await service.findOne(supermarketList[0].id);
    expect(supermarket.id).toBe(supermarketList[0].id);
  });

  it('FindOne non existing entity', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('FindAll', async () => {
    const entities = await service.findAll();
    expect(entities.length).toBe(supermarketList.length);
  });

  it('Create', async () => {
    const entity = {
      id: faker.database.mongodbObjectId(),
      nombre: faker.datatype.string(11),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      url: faker.internet.url(),
    };

    const savedEntity: SupermercadoEntity = await service.create(entity);
    expect(savedEntity.nombre).toBe(savedEntity.nombre);
  });

  it('Create invalid entity', async () => {
    const entity = {
      id: faker.database.mongodbObjectId(),
      nombre: faker.datatype.string(5),
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      url: faker.internet.url(),
    };
    await expect(() => service.create(entity)).rejects.toHaveProperty('type', BusinessError.BAD_REQUEST);
  });

  it('Update entity', async () => {
    const supermarket = supermarketList[0];
    supermarket.nombre = "Test name with 11 characters";
    const saveEntity = await service.update(supermarket);
    expect(saveEntity.nombre).toBe(supermarket.nombre);
  });

  it('update non existing entity', async () => {
    const supermarket = supermarketList[0];
    supermarket.id = '0';
    await expect(() => service.update(supermarket)).rejects.toHaveProperty('type',BusinessError.NOT_FOUND);
  });

  it('Invalid entity update', async () => {
    const supermarket = supermarketList[0];
    supermarket.nombre = faker.datatype.string(5);
    await expect(() => service.update(supermarket)).rejects.toHaveProperty('type', BusinessError.BAD_REQUEST);
  });

  it('Delete entity', async () => {
    const size = supermarketList.length;
    await service.delete(supermarketList[0].id);
    const supermarkets = await service.findAll();
    expect(supermarkets.length).toBe(size - 1);
  });

  it('Delete non existing entity', async () => {await expect(() => service.delete('0')).rejects.toHaveProperty('type',BusinessError.NOT_FOUND);
  });
});