import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
    @Column()
  nombre: string;

  @Column()
  latitud: number;

  @Column()
  longitud: number;

  @Column()
  url: string;
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermercados)
  ciudades?: CiudadEntity[];
}