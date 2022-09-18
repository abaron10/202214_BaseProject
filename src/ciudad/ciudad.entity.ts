import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Entity()
export class CiudadEntity {

    @Column()
    nombre: string;

    @Column()
    pais: string;

    @Column()
    habitantes: number;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => SupermercadoEntity, (supermercado) => supermercado.ciudades)
    @JoinTable()
    supermercados?: SupermercadoEntity[];

}
