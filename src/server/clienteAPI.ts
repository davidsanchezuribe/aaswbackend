import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { clienteRepository } from '../AppDataSource';
import Cliente from '../model/Cliente';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const clientAPI = express.Router();

clientAPI.get(
  '/',
  async (req: Request, res: Response) => {
    try {
      const allClients = await clienteRepository.find();
      return res.status(200).json({ clients: allClients });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

clientAPI.get(
  '/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const client = await clienteRepository.findOneBy({ id });
      return res.status(200).json({ client });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

clientAPI.post(
  '/',
  body('id').exists().isString(),
  body('nombre').exists().isString(),
  body('direccion_residencia').exists().isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id, nombre, direccion_residencia } = req.body;
    const newClient : Cliente = new Cliente(id, nombre, direccion_residencia);
    try {
      await clienteRepository.insert(newClient);
      return res.status(200).json({ msg: 'Registro Creado Con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

clientAPI.patch(
  '/',
  body('id').exists().isString(),
  body('nombre').exists().isString(),
  body('direccion_residencia').exists().isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id, nombre, direccion_residencia } = req.body;
    const newClient : Cliente = new Cliente(id, nombre, direccion_residencia);
    try {
      await clienteRepository.save(newClient);
      return res.status(200).json({ msg: 'Registro Actualizado Con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

clientAPI.delete(
  '/',
  body('id').exists().isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id } = req.body;
    try {
      const clientToRemove = await clienteRepository.findOneBy({ id });
      if (clientToRemove === null) {
        return res.status(400).json({ msg: `El usuario con el id ${id} no existe` });
      }
      await clienteRepository.remove(clientToRemove);
      return res.status(200).json({ msg: 'Registro borrado con éxito' });
    } catch (error) {
      return res.status(400).json({ msg: getErrorMessage(error) });
    }
  },
);

export default clientAPI;
