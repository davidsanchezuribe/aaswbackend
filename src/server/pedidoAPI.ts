import express, { Request, Response } from 'express';
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
      const allOrders = await pedidoRepository.find();
      return res.status(200).json({ orders: allOrders });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

export default pedidoAPI;
