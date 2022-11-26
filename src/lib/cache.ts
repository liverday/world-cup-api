import Redis from 'ioredis';

const redisUri = process.env.REDIS_URI;

if (!redisUri) {
  throw new Error(
    'There is not REDIS_URI available, cache will not initialize',
  );
}

const client = new Redis(redisUri!);

export async function getItem<T>(key: string): Promise<T | null> {
  const data = await client.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as T;
}

export async function saveItem<T>(key: string, data: T): Promise<void> {
  await client.set(key, JSON.stringify(data));
}

export async function removeKey(key: string): Promise<boolean> {
  const rowsAffected = await client.unlink(key);
  return rowsAffected > 0;
}

export async function removeAllKeys(): Promise<void> {
  await client.flushall();
}
