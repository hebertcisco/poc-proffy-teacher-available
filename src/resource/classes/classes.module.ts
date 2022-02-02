import {CacheModule, Module} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from './entities/classes.entity';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {redisUrl} from "../../shared/common/helpers/redis-url";
import {REDIS_CACHE_OPTIONS} from "../../infra/redis/redis.config";
import {RedisCacheModule} from "../../shared/resource/redis-cache/redis-cache.module";
import {Teacher} from "../teacher/entities/teacher.entity";
import {TeacherService} from "../teacher/teacher.service";
import {Student} from "../student/entities/student.entity";
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([Classes, Teacher, Student, User]),
        ClientsModule.register([
            {
                name: 'CLASSES_SERVICE',
                transport: Transport.REDIS,
                options: {
                    url: redisUrl,
                }
            },
        ]),
        CacheModule.register({
            ...REDIS_CACHE_OPTIONS
        }),
        RedisCacheModule],
    controllers: [ClassesController],
    providers: [ClassesService, TeacherService, UserService],
})
export class ClassesModule {}
