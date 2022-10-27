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

export const fillDatabase = async () => {
  const clientes: Cliente[] = [];
  for (let i = 0; i < 40; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const newClient = await clienteRepository.save(Cliente.fake());
      clientes.push(newClient);
    } catch (error) {
      console.log(error);
    }
  }
  const productos: Producto[] = [];
  for (let i = 0; i < 120; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const newProduct = await productoRepository.save(Producto.fake());
      productos.push(newProduct);
    } catch (error) {
      console.log(error);
    }
  }
  for (let i = 0; i < 100; i += 1) {
    try {
      const randomClient = clientes[Math.floor(Math.random() * clientes.length)];
      // eslint-disable-next-line no-await-in-loop
      const newOrder = await pedidoRepository.save(Pedido.fake(randomClient));
      for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j += 1) {
        try {
          const randomProduct = productos[Math.floor(Math.random() * productos.length)];
          // eslint-disable-next-line no-await-in-loop
          await entradaPedidoRepository.save(EntradaPedido.fake(randomProduct, newOrder));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};
