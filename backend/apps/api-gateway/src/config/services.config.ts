import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), 'apps/api-gateway/.env') });

export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL ?? 'http://auth-service:3001',

  INVENTORY:
    process.env.INVENTORY_SERVICE_URL ?? 'http://inventory-service:3002',

  BOOKING: process.env.BOOKING_SERVICE_URL ?? 'http://booking-service:3003',

  HOTEL: process.env.HOTEL_SERVICE_URL ?? 'http://hotel-service:3004',

  NOTIFICATION:
    process.env.NOTIFICATION_SERVICE_URL ?? 'http://notification-service:3005',

  PAYMENT: process.env.PAYMENT_SERVICE_URL ?? 'http://payment-service:3006',

  REVIEW: process.env.REVIEW_SERVICE_URL ?? 'http://review-service:3007',

  SEARCH: process.env.SEARCH_SERVICE_URL ?? 'http://search-service:3008',

  USER: process.env.USER_SERVICE_URL ?? 'http://user-service:3009',
};
