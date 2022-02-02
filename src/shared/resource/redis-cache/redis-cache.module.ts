import {CacheModule, Module} from '@nestjs/common';
import {RedisCacheService} from "./redis-cache.service";

@Module({
  imports: [
    CacheModule.register()],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
