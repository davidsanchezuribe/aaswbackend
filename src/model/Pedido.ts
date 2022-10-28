import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-cycle
import Cliente from './Cliente';
// eslint-disable-next-line import/no-cycle
import EntradaPedido from './EntradaPedido';

@Entity()
class Pedido {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Cliente, (cliente: Cliente) => cliente.pedidos)
  @JoinColumn()
    cliente: Cliente;

  @Column({ type: 'date' })
    date: Date;

  @Column()
    direccion_entrega: string;

  @Column()
    numero_impresiones: number;

  @OneToMany(
    () => EntradaPedido,
    (entradaPedido: EntradaPedido) => entradaPedido.pedido,
    { onDelete: 'CASCADE' },
  )
    entradas!: EntradaPedido[];

  constructor(cliente: Cliente, direccion_entrega: string, date: Date = new Date()) {
    this.cliente = cliente;
    this.date = date;
    this.direccion_entrega = direccion_entrega;
    this.numero_impresiones = 0;
  }

  static fake(cliente: Cliente) {
    const direccionEntrega = faker.address.streetAddress(true);
    const date = faker.date.between(1322629200000, 1666905063658);
    return new Pedido(cliente, direccionEntrega, date);
  }
}

export default Pedido;
