import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-cycle
import EntradaPedido from './EntradaPedido';

type UnitValues = 'kg' | 'uds' | 'lb';

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
    unidades: UnitValues;

  @Column()
    existencia: number;

  @OneToMany(() => EntradaPedido, (entradaPedido: EntradaPedido) => entradaPedido.producto)
    entradas!: EntradaPedido[];

  constructor(
    nombre: string,
    unidades: UnitValues,
    precio: number = 0.0,
    existencia: number = 0,
  ) {
    this.nombre = nombre;
    this.unidades = unidades;
    this.precio = precio;
    this.existencia = existencia;
  }

  static fake() {
    const nombre = faker.commerce.productName().concat(' ', faker.commerce.productAdjective());
    const values: UnitValues[] = ['kg', 'uds', 'lb'];
    const randomNumber = faker.datatype.number({
      min: 0,
      max: values.length - 1,
    });
    const unidades = values[randomNumber];
    const precio = faker.datatype.float({
      min: 0.0,
      max: 50000.0,
    });
    const existencia = faker.datatype.number({
      min: 0,
      max: 250,
    });
    return new Producto(nombre, unidades, precio, existencia);
  }
}

export default Producto;
