# ---Variables globales---
APP_NAME="backend-nodejs"
APP_DESCRIPTION="Backend API Service"
APP_TITLE="Backend App"
SUBDIRECTORY="/test/"
PROD_PORT="8080"
ORIGIN="localhost:8000"

# ---Creacion del archivo de administracion de dependencias npm---
echo "{
  \"name\": \"${APP_NAME}\",
  \"version\": \"1.0.0\",
  \"description\": \"${APP_DESCRIPTION}\",
  \"main\": \"index.js\",  
  \"scripts\": {
    \"start\": \"nodemon\",
    \"build\": \"tsc\",
    \"docker-build-start\": \"docker build . -t dei/${APP_NAME}:1.0.0 && docker run -p 49160:8080 -d dei/${APP_NAME}:1.0.0\",
    \"docker-remove\": \"docker kill \$(docker ps -q) && docker rm \$(docker ps -a -q)\",
    \"prettier\": \"prettier --config .prettierrc.json --write src/**/*.ts\",
    \"test\": \"jest\"
  },
  \"husky\": {
    \"hooks\": {
      \"pre-commit\": \"pretty-quick --staged\"
    }
  },
  \"author\": \"\",
  \"license\": \"ISC\"
}
" > ./package.json

# ---Instalacion de dependencias---
# Typescript
npm install --save-dev typescript ts-node
# Express
npm install --save-dev @types/express @types/cors
npm install --save express cors body-parser
# Nodemon
npm install --save-dev nodemon
# Eslint
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript
npm install --save-dev eslint-plugin-import eslint-plugin-promise 
# Prettier Husky
npm install --save-dev prettier husky pretty-quick
# Test
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
# Env reader
npm install --save dotenv 

echo '{
  "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "sourceMap": true,
      "outDir": "./dist",
      "rootDir": "./src",
      "strict": true,
      "noImplicitAny": true,
      "moduleResolution": "node",
      "baseUrl": "./src",
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true//
  },
  "lib": ["es2015"],
  "include": ["src/**/*", "environment.d.ts"],
  "exclude": ["node_modules"]
}' > ./tsconfig.json
echo '{
    "watch": ["src"],
    "ext": ".ts",
    "ignore": [],
    "exec": "ts-node ./src/index.ts"
}' > ./nodemon.json
mkdir src
echo "import * as dotenv from 'dotenv';
import app from './server/app';
// @imports

dotenv.config();
const { NODE_ENV, PROD_PORT, DEV_PORT } = process.env;

const port = NODE_ENV === 'production'
  ? PROD_PORT
  : DEV_PORT;

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(\`listen on port \${port}\`);
});" > ./src/index.ts
mkdir src/server
echo "// libreria que recibe los llamados REST de la api
import express from 'express';
// librería para permitir el accesso desde ${ORIGIN}
import cors from 'cors';
// libreria para detectar el formato json automáticamente
import bodyParser from 'body-parser';

import clientAPI from './clientAPI';

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '${ORIGIN}' }));
app.use('/client', clientAPI);

export default app;" > ./src/server/app.ts
echo "import express, { Request, Response } from 'express';

const clientAPI = express.Router();

clientAPI.get('/test', (req: Request, res: Response) => {
  res.send('Hello World');
});

export default clientAPI;" > ./src/server/clientAPI.ts
echo '{
    "env": {
        "es2020": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "airbnb-typescript/base"
    ],
    "parserOptions": {
        "project": "./tsconfig.json",
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "promise",
        "import"
    ],
    "ignorePatterns": ["jest.config.js", ".eslintrc.json"],
    "rules": {}
}' > ./.eslintrc.json
echo '{
  "singleQuote": true,
  "arrowParens": "always",
  "printWidth": 120
}' > ./.prettierrc.json
echo "dist" > ./.prettierignore
echo "module.exports = {
    clearMocks: true,
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    preset: 'ts-jest'
};" > ./jest.config.js
echo "# Dependency directories
node_modules/
.env" > ./.gitignore
echo "NODE_ENV=production
DEV_PORT=7000
PROD_PORT=${PROD_PORT}" > ./.env
echo "declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    DEV_PORT: number;
    PROD_PORT: number;//
  }
}" > ./environment.d.ts
echo "FROM node:lts as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

FROM node:lts-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./.env
EXPOSE 8080
CMD [\"node\", \"dist/index.js\"]" > ./Dockerfile
echo "node_modules
npm-debug.log" > ./.dockerignore
npm run start
