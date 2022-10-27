DATABASE_TYPE=mysql
npm install --save typeorm reflect-metadata
sed -i '' "s/\/\/ @imports/import 'reflect-metadata';\\
import AppDataSource from '.\/AppDataSource';\\
\/\/ @imports/g" src/index.ts
echo "
AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line
    console.log('initialized database');
  })
  .catch((error: string) => {
    // eslint-disable-next-line
    console.log(error);
  });" >> src/index.ts
if [ $DATABASE_TYPE = mysql ]
then
    npm install mysql --save
fi
sed -i '' "s/\/\//,\\
      \"emitDecoratorMetadata\": true,\\
      \"experimentalDecorators\": true\/\//g" tsconfig.json
mkdir src/model
mkdir src/migration
echo "import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Photo {
  @PrimaryGeneratedColumn()
    id: number = 0;

  @Column({
    length: 100,
  })
    name: string = '';

  @Column('text')
    description: string | null = null;

  @Column()
    filename: string | null = null;

  @Column('double')
    views: number = 0.0;

  @Column()
    isPublished: boolean = false;
}

export default Photo;" > ./src/model/Photo.ts
echo "DATABASE_HOST=localhost
DATABASE_PORT=-1
DATABASE_USERNAME=root
DATABASE_PASSWORD=admin
DATABASE_NAME=test" >> ./.env
sed -i '' "s/\/\//\\
    DATABASE_HOST: string;\\
    DATABASE_PORT: number;\\
    DATABASE_USERNAME: string;\\
    DATABASE_PASSWORD: string;\\
    DATABASE_NAME: string;\/\//g" environment.d.ts
echo "import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import Photo from './model/Photo';

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const AppDataSource = new DataSource({
  type: '${DATABASE_TYPE}',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT) === -1 ? undefined : Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: [Photo],
  synchronize: true,
  logging: false,
});

export default AppDataSource;" > ./src/AppDataSource.ts;