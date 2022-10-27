import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-cycle
import Pedido from './Pedido';
// eslint-disable-next-line import/no-cycle
import Producto from './Producto';

@Entity()
class EntradaPedido {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Pedido, (pedido: Pedido) => pedido.entradas)
    pedido: Pedido;

  @ManyToOne(() => Producto, (producto: Producto) => producto.entradas)
  @JoinColumn()
    producto: Producto;

  @Column()
    cantidad: number;

  constructor(producto: Producto, pedido: Pedido, cantidad: number = 0) {
    this.producto = producto;
    this.pedido = pedido;
    this.cantidad = cantidad;
  }

  static fake(producto: Producto, pedido: Pedido) {
    const cantidad = faker.datatype.number({
      min: 1,
      max: 25,
    });
    return new EntradaPedido(producto, pedido, cantidad);
  }
}

export default EntradaPedido;
