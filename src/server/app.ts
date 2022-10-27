// libreria que recibe los llamados REST de la api
import express from 'express';
// librería para permitir el accesso desde localhost:8000
import cors from 'cors';
// libreria para detectar el formato json automáticamente
import bodyParser from 'body-parser';

import clienteAPI from './clienteAPI';
import productoAPI from './productoAPI';
import pedidoAPI from './pedidoAPI';

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'localhost:8000' }));
app.use('/cliente', clienteAPI);
app.use('/producto', productoAPI);
app.use('/pedido', pedidoAPI);

export default app;
