import {CacheModule, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {REDIS_CACHE_OPTIONS} from "../../infra/redis/redis.config";
import {RedisCacheModule} from "../../shared/resource/redis-cache/redis-cache.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CacheModule.register({
            ...REDIS_CACHE_OPTIONS
        }),
        RedisCacheModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
