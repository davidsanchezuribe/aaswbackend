declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    DEV_PORT: number;
    PROD_PORT: number;
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;//
  }
}
