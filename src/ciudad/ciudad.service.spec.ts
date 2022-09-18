import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CityService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let citiesList = [];

  const seedDatabase = async () => {
    repository.clear();
    citiesList = [];
    for (let i = 0; i < 10; i++) {
      const ciudad: CiudadEntity = await repository.save({
        id: faker.database.mongodbObjectId(),
        nombre: faker.address.city(),
        pais: "Argentina"
      ,
      noHabitantes: Math.random() 
      });
      citiesList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CiudadEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(citiesList.length);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message',"The city with the given id was not found");
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CiudadEntity = citiesList[0];
    const city: CiudadEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.nombre).toEqual(storedCity.nombre);
  });

  it('create should return a new city', async () => {
    const city: CiudadEntity = {
      id: faker.database.mongodbObjectId(),
      nombre: faker.address.city(),
      pais: "Argentina",
      noHabitantes: Math.random() 
    };
    const newCity: CiudadEntity = await service.create(city);
    expect(newCity).not.toBeNull();
    const storedCity: CiudadEntity = await repository.findOne({where: { id: newCity.id }});
    expect(storedCity.nombre).toEqual(newCity.nombre);
    expect(storedCity).not.toBeNull();
  });

  it('update should modify an existent city', async () => {
    const city: CiudadEntity = citiesList[0];
    city.nombre = 'test';
    const updatedCity: CiudadEntity = await service.update(city);
    expect(updatedCity).not.toBeNull();
    const storedCity: CiudadEntity = await repository.findOne({where: { id: city.id }});
    expect(storedCity).not.toBeNull();
    expect(storedCity.nombre).toEqual(city.nombre);
  });

  it('update should return error for an invalid city', async () => {
    const city: CiudadEntity = {
      id: faker.database.mongodbObjectId(),
      nombre: faker.address.city(),
      pais: "Argentina",
      noHabitantes: Math.random() 
    };
    await expect(() => service.update(city)).rejects.toHaveProperty('message','The city with the given id was not found');
  });

  it('Should delete a city', async () => {
    const city: CiudadEntity = citiesList[0];
    await service.delete(city.id);
    const deletedCity: CiudadEntity = await repository.findOne({where: { id: city.id }});
    expect(deletedCity).toBeNull();
  });

  it('delete should return exception for an invalid city', async () => {
    const city: CiudadEntity = citiesList[0];
    await service.delete(city.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty('message','The city with the given id was not found');
  });
});