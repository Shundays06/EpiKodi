import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('Redis URL not configured. Caching will be disabled.');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          if (times > 3) {
            return null; // Stop retrying
          }
          return Math.min(times * 50, 2000);
        },
      });

      redis.on('error', (err) => {
        console.error('Redis error:', err);
      });

      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      return null;
    }
  }

  return redis;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedData(
  key: string,
  data: any,
  expireSeconds: number = 3600
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(key, expireSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function deleteCachedData(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

export async function clearCache(pattern?: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    if (pattern) {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } else {
      await client.flushall();
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}
