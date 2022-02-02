import {Cache} from 'cache-manager';
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";

@Injectable()
export class RedisCacheService {
  constructor(
      @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  public async get(key: string): Promise<string> {
    return await this.cache.get(key);
  }

  public async set(key: string, value: string): Promise<string> {
    return await this.cache.set(key, value);
  }

  public async del(key: string): Promise<void> {
    return await this.cache.del(key);
  }
}