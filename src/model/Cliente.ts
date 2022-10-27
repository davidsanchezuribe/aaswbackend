import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-cycle
import Pedido from './Pedido';

@Entity()
class Cliente {
  @PrimaryColumn()
    id: string;

  @Column()
    nombre: string;

  @Column()
    direccion_residencia: string;

  @OneToMany(() => Pedido, (pedido: Pedido) => pedido.cliente)
    pedidos!: Pedido[];

  constructor(id: string, nombre: string, direccion_residencia: string) {
    this.id = id;
    this.nombre = nombre;
    this.direccion_residencia = direccion_residencia;
  }

  static fake() {
    const id = faker.datatype.number({
      min: 8000000,
      max: 1000000000,
    }).toString();
    const nombre = faker.company.name();
    const direccionResidencia = faker.address.streetAddress(true);
    return new Cliente(id, nombre, direccionResidencia);
  }
}

export default Cliente;
