import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../data/campaigns.db'),
  nodeEnv: process.env.NODE_ENV || 'development'
};
