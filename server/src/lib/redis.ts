import { createClient, RedisClientType } from 'redis';
import 'dotenv/config';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('FATAL ERROR: REDIS_URL is not defined in .env file.');
}

const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server successfully!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  if (redisUrl) {
    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis on startup:', err);
    }
  }
})();

export default redisClient;
