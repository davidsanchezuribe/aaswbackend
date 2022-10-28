import express, { Request, Response } from 'express';
import {
  body, check, param, validationResult,
} from 'express-validator';
import EntradaPedido from '../model/EntradaPedido';
import Pedido from '../model/Pedido';
// import { body, validationResult } from 'express-validator';
import {
  clienteRepository, entradaPedidoRepository, pedidoRepository, productoRepository,
} from '../AppDataSource';
// import Pedido from '../model/Pedido';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const pedidoAPI = express.Router();

pedidoAPI.get(
  '/',
  async (req: Request, res: Response) => {
    try {
      const allOrders = await pedidoRepository.find({
        relations: {
          cliente: true,
          entradas: {
            producto: true,
          },
        },
      });
      return res.status(200).json({ orders: allOrders });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

pedidoAPI.get(
  '/:id',
  param('id').isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.body;
    const order = await pedidoRepository.findOne({
      where: { id },
      relations: {
        cliente: true,
        entradas: {
          producto: true,
        },
      },
    });
    return res.status(200).json({ order });
  },
);

pedidoAPI.post(
  '/incrementarimpresion',
  body('id').isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.body;
    const orderToUpdate = await pedidoRepository.findOneBy({ id });
    try {
      if (orderToUpdate != null) {
        orderToUpdate.numero_impresiones += 1;
        await pedidoRepository.save(orderToUpdate);
      } else {
        return res.status(400).json({ msg: `El pedido ${id} no existe` });
      }
      return res.status(200).json({ orderToUpdate });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

pedidoAPI.post(
  '/',
  body('clienteId').exists().isString(),
  body('direccionEntrega').exists().isString(),
  check('entradas').isArray(),
  check('entradas.*.productoId').exists().isInt(),
  check('entradas.*.cantidad').exists().isInt({ gt: 0 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      clienteId,
      direccionEntrega,
      entradas,
    } = req.body;
    try {
      const cliente = await clienteRepository.findOneByOrFail({ id: clienteId });
      const orden = await pedidoRepository.save(new Pedido(cliente, direccionEntrega));
      const detalle = await Promise.all(entradas.map(async ({ productoId, cantidad }:
      { productoId: number, cantidad: number }) => {
        const producto = await productoRepository.findOneByOrFail({ id: productoId });
        const newEntry = await entradaPedidoRepository
          .create(new EntradaPedido(producto, orden, cantidad));
        return newEntry;
      }));
      return res.status(200).json({ orden, detalle });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

pedidoAPI.delete(
  '/',
  body('id').isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.body;

    try {
      const orderToDelete = await pedidoRepository.findOneByOrFail({ id });
      pedidoRepository.remove(orderToDelete);
      return res.status(200).json({ msg: `Pedido ${id} eliminado con exito` });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

export default pedidoAPI;
