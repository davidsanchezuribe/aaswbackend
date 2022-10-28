import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { productoRepository } from '../AppDataSource';
import Producto from '../model/Producto';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const productoAPI = express.Router();

productoAPI.get(
  '/',
  async (req: Request, res: Response) => {
    try {
      const allProducts = await productoRepository.find();
      return res.status(200).json({ products: allProducts });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

productoAPI.get(
  '/:id',
  param('id').isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const product = await productoRepository.findOneByOrFail({ id: parseInt(id, 10) });
      return res.status(200).json({ product });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

productoAPI.post(
  '/',
  body('nombre').exists().isString(),
  body('precio').isFloat(),
  body('unidades').exists().isString().isIn(['kg', 'uds', 'lb']),
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
    try {
      const newProduct : Producto = new Producto(nombre, unidades, precio, existencia);
      await productoRepository.insert(newProduct);
      return res.status(200).json({ msg: 'Registro Creado Con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

productoAPI.patch(
  '/',
  body('id').exists().isInt(),
  body('nombre').exists().isString(),
  body('precio').isFloat(),
  body('unidades').exists().isString().isIn(['kg', 'uds', 'lb']),
  body('existencia').exists().isNumeric(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      nombre, precio, unidades, existencia, id,
    } = req.body;
    try {
      const product : Producto = await productoRepository
        .findOneOrFail({ where: { id } });
      product.nombre = nombre;
      product.precio = precio;
      product.unidades = unidades;
      product.existencia = existencia;
      await productoRepository.save(product);
      return res.status(200).json({ msg: 'Registro Creado Con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

productoAPI.delete(
  '/',
  body('id').isInt(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.body;

    try {
      const productToDelete = await productoRepository.findOneByOrFail({ id });
      productoRepository.remove(productToDelete);
      return res.status(200).json({ msg: `Pedido ${id} eliminado con exito` });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

export default productoAPI;
