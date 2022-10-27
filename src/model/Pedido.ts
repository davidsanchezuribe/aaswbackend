import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Cliente from './Cliente';
// eslint-disable-next-line import/no-cycle
import EntradaPedido from './EntradaPedido';

@Entity()
class Pedido {
  @PrimaryGeneratedColumn()
    id!: number;

  @OneToOne(() => Cliente)
  @JoinColumn()
    cliente: Cliente;

  @Column({ type: 'date' })
    date: Date;

  @Column()
    direccion_entrega: string;

  @Column()
    numero_impresiones: number;

  @OneToMany(() => EntradaPedido, (entradaPedido: EntradaPedido) => entradaPedido.pedido)
    entradas!: EntradaPedido[];

  constructor(cliente: Cliente, direccion_entrega: string) {
    this.cliente = cliente;
    this.date = new Date();
    this.direccion_entrega = direccion_entrega;
    this.numero_impresiones = 0;
  }
}

export default Pedido;
