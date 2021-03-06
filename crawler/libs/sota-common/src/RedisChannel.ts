import { createClient, RedisClient } from 'redis';
import util from 'util';
import { EnvConfigRegistry } from './registries';
import { getLogger } from './Logger';

const logger = getLogger('RedisChannel');

export function subForTokenChanged() {
  const sub = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  });
  const appId = EnvConfigRegistry.getAppId();
  sub.subscribe(`${appId}`);

  // TODO: Make this more generic
  sub.on('message', (channel, message) => {
    // To reload data, just exit and let supervisor starts process again
    if (message === 'EVENT_NEW_ERC20_TOKEN_ADDED' || message === 'EVENT_NEW_ERC20_TOKEN_REMOVED') {
      logger.warn(`RedisChannel::subForTokenChanged on message=${message}. Will exit to respawn...`);
      process.exit(0);
    }
  });
}

interface IRedisPromiseClient {
  setex(key: string, seconds: number, value: string): Promise<string>;
  set(key: string, value: string): Promise<string>;
  get(key: string): Promise<string>;
}

let client: RedisClient;
let promiseClient: IRedisPromiseClient;
export function getClient() {
  if (!client) {
    client = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });
    promiseClient = {
      setex: util.promisify(client.setex).bind(client),
      set: util.promisify(client.set).bind(client),
      get: util.promisify(client.get).bind(client),
    };
  }
  return promiseClient;
}
