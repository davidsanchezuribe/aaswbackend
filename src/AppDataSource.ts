import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import Cliente from './model/Cliente';
import Producto from './model/Producto';
import Pedido from './model/Pedido';
import EntradaPedido from './model/EntradaPedido';

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT) === -1 ? undefined : Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [Cliente, Producto, Pedido, EntradaPedido],
  synchronize: true,
  logging: false,
});

export const clienteRepository = AppDataSource.getRepository(Cliente);
export const productoRepository = AppDataSource.getRepository(Producto);
export const pedidoRepository = AppDataSource.getRepository(Pedido);
export const entradaPedidoRepository = AppDataSource.getRepository(EntradaPedido);
