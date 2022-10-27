import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Pedido from './Pedido';
import Producto from './Producto';

@Entity()
class EntradaPedido {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Pedido, (pedido: Pedido) => pedido.entradas)
    pedido: Pedido;

  @OneToOne(() => Producto)
  @JoinColumn()
    producto: Producto;

  @Column()
    cantidad: number;

  constructor(producto: Producto, pedido: Pedido, cantidad: number = 0) {
    this.producto = producto;
    this.pedido = pedido;
    this.cantidad = cantidad;
  }
}

export default EntradaPedido;
