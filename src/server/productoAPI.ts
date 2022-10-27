import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { productoRepository } from '../AppDataSource';
import Producto from '../model/Producto';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const productoAPI = express.Router();

productoAPI.post(
  '/',
  body('nombre').exists().isString(),
  body('precio').isFloat(),
  body('unidades').exists().isString(),
  body('existencia').exists().isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      nombre, precio, unidades, existencia,
    } = req.body;
    const newProduct : Producto = new Producto(nombre, unidades, precio, existencia);
    try {
      await productoRepository.insert(newProduct);
      return res.status(200).json({ msg: 'Registro Creado Con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

export default productoAPI;
