import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database.config';

async function testConnection() {
  try {
    const AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'tiquetera_prod',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    });

    await AppDataSource.initialize();
    console.log('✅ Conexión exitosa a la base de datos');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

testConnection(); 