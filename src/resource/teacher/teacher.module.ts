import {CacheModule, Module} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Teacher } from './entities/teacher.entity';
import { UserService } from '../user/user.service';
import { Student } from '../student/entities/student.entity';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {redisUrl} from "../../shared/common/helpers/redis-url";
import {REDIS_CACHE_OPTIONS} from "../../infra/redis/redis.config";
import {RedisCacheModule} from "../../shared/resource/redis-cache/redis-cache.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Teacher,
            User,
            Student,
        ]),
        ClientsModule.register([
            {
                name: 'TEACHER_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: redisUrl,
                }
            },
        ]),
        CacheModule.register({
            ...REDIS_CACHE_OPTIONS
        }),
        RedisCacheModule,
    ],
    controllers: [TeacherController],
    providers: [TeacherService, UserService],
})
export class TeacherModule {}
