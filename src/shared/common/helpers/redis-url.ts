import {REDIS_CONFIG} from "../../../infra/redis/redis.config";

export const redisUrl: string = `redis://:${REDIS_CONFIG.password}@${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`;
