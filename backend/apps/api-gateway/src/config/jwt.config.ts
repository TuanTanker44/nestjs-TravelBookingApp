import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), 'apps/api-gateway/.env') });

export const jwtConfig = {
  secret: process.env.JWT_SECRET,

  expiresIn: '1d',
};
