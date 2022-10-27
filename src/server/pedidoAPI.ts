import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
// import { body, validationResult } from 'express-validator';
import { pedidoRepository } from '../AppDataSource';
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

export default pedidoAPI;
