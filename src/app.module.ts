import {CacheModule, Module} from '@nestjs/common';
import { UserModule } from './resource/user/user.module';
import {REDIS_CACHE_OPTIONS} from "./infra/redis/redis.config";
import { TypeOrmModule } from '@nestjs/typeorm';
import {ClassesModule} from "./resource/classes/classes.module";
import {StudentModule} from "./resource/student/student.module";
import {TeacherModule} from "./resource/teacher/teacher.module";
import { join } from 'path';

@Module({
  imports: [
    CacheModule.register({
      ...REDIS_CACHE_OPTIONS
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        join(__dirname, '/../', '*', '*.entity{.ts,.js}'),
        'dist/**/**/**/*.entity{.js}',
        'src/**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    ClassesModule,
    StudentModule,
    TeacherModule,
  ],
})
export class AppModule {
  constructor() {
    this.init();
  }
  init(): void {
    process.stdout.write(`\nInitialized with successfully\n`)
  }
}
