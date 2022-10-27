import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['nombre'])
class Producto {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    nombre: string;

  @Column({ type: 'double', nullable: true })
    precio: number;

  @Column()
    unidades: 'kg' | 'uds' | 'lb';

  @Column()
    existencia: number;

  constructor(
    nombre: string,
    unidades: 'kg' | 'uds' | 'lb',
    precio: number = 0.0,
    existencia: number = 0,
  ) {
    this.nombre = nombre;
    this.unidades = unidades;
    this.precio = precio;
    this.existencia = existencia;
  }
}

export default Producto;
