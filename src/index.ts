import * as dotenv from 'dotenv';
import app from './server/app';
import 'reflect-metadata';
import { AppDataSource } from './AppDataSource';
// @imports

dotenv.config();
const { NODE_ENV, PROD_PORT, DEV_PORT } = process.env;

const port = NODE_ENV === 'production'
  ? PROD_PORT
  : DEV_PORT;

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`listen on port ${port}`);
});

AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line
    console.log('initialized database');
  })
  .catch((error: string) => {
    // eslint-disable-next-line
    console.log(error);
  });
