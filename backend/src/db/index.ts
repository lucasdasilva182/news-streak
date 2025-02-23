import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

pool.on('connect', (client) => {
  client.query('SELECT 1');
});

export const connectToDatabase = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conectado ao banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

process.on('SIGINT', () => pool.end());
process.on('SIGTERM', () => pool.end());

export default pool;
