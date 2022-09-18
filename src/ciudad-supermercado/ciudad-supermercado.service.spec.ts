import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let cityRepository: Repository<CiudadEntity>;
  let superMarketRepository: Repository<SupermercadoEntity>;
  let superMarketList: SupermercadoEntity[];
  let cityList: CiudadEntity[];

  const seedCityDatabase = async () => {
    cityRepository.clear();
    cityList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await cityRepository.save({
        nombre: faker.datatype.string(11),
        pais: 'Argentina',
        noHabitantes: Math.random(),
        supermercados: [],
      });
      cityList.push(ciudad);
    }
  };

  const seedSuperMarketDatabase = async () => {
    superMarketRepository.clear();
    superMarketList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await superMarketRepository.save({
          id: faker.database.mongodbObjectId(),
          nombre: faker.datatype.string(11),
          latitud: parseFloat(faker.address.latitude()),
          longitud: parseFloat(faker.address.longitude()),
          url: faker.internet.url(),
          ciudades: [],
        });
        superMarketList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);

    cityRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    superMarketRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedCityDatabase();
    await seedSuperMarketDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Add supermarket to city', async () => {
    const persistedCity = await service.addSupermarketToCity(cityList[0].id,superMarketList[0].id);
    expect(persistedCity.supermercados.length).toBe(1);
    expect(persistedCity.supermercados[0].id).toBe(superMarketList[0].id);
  });

  it('Add supermarket to non existing city', async () => {
    await expect(() => service.addSupermarketToCity('0', superMarketList[0].id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Add non existing supermarket to city', async () => {
    await expect(() =>
      service.addSupermarketToCity(cityList[0].id, '0')).rejects.toHaveProperty('type', BusinessError.NOT_FOUND)});

  it('Find supermarkets from city', async () => {
    await service.addSupermarketToCity(cityList[0].id, superMarketList[0].id);
    const supermarketsFromCity = await service.findSupermarketsFromCity(cityList[0].id);
    expect(supermarketsFromCity.length).toBe(1);
    expect(supermarketsFromCity[0].id).toBe(superMarketList[0].id);
  });

  it('Find supermarkets from non existing city', async () => {
    await expect(() => service.findSupermarketsFromCity('0')).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Find supermarket from city', async () => {
    await service.addSupermarketToCity(cityList[0].id,superMarketList[0].id);
    const persistedSupermarket = await service.findSupermarketFromCity(cityList[0].id,superMarketList[0].id);
    expect(persistedSupermarket.id).toBe(superMarketList[0].id);
  });

  it('Find supermarket from non existing city', async () => {
    await expect(() => service.findSupermarketFromCity('0', superMarketList[0].id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Find non exising supermarket from city', async () => {
    await expect(() => service.findSupermarketFromCity(cityList[0].id, '0')).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Update supermarkets from city', async () => {
    const persistedCity = await service.updateSupermarketsFromCity(
      cityList[0].id,
      superMarketList,
    );
    expect(persistedCity.supermercados.length).toBe(superMarketList.length);
  });

  it('Update supermarkets from non existing city', async () => {
    await expect(() => service.updateSupermarketsFromCity('0', superMarketList)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Update non existing supermarkets from city', async () => {
    superMarketList[0].id = '0';
    await expect(() => service.updateSupermarketsFromCity(cityList[0].id, superMarketList)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Delete supermarket from city', async () => {
    let persistedCity: CiudadEntity = await service.addSupermarketToCity(cityList[0].id,superMarketList[0].id);
    expect(persistedCity.supermercados.length).toBe(1);
    persistedCity = await service.deleteSupermarketFromCity(cityList[0].id,superMarketList[0].id);
    expect(persistedCity.supermercados.length).toBe(0);
  });

  it('Delete supermarket from non existing city', async () => {
    const persistedCity: CiudadEntity = await service.addSupermarketToCity(cityList[0].id, superMarketList[0].id);
    expect(persistedCity.supermercados.length).toBe(1);
    await expect(() => service.deleteSupermarketFromCity('0', superMarketList[0].id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });
  
  it('Delete non existing supermarket from city', async () => {
    const persistedCity: CiudadEntity = await service.addSupermarketToCity(cityList[0].id, superMarketList[0].id);
    expect(persistedCity.supermercados.length).toBe(1);
    await expect(() => service.deleteSupermarketFromCity('0', superMarketList[0].id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });
  
  it('Delete not assigned supermarket from city', async () => {
    const persistedCity: CiudadEntity = await service.addSupermarketToCity(
      cityList[0].id,
      superMarketList[0].id,
    );
    expect(persistedCity.supermercados.length).toBe(1);
    await expect(() => service.deleteSupermarketFromCity(cityList[0].id,superMarketList[1].id)).rejects.toHaveProperty('type', BusinessError.BAD_REQUEST);
  });
  
});