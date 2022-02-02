import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Student } from './entities/student.entity';
import { UserService } from '../user/user.service';
import { Teacher } from '../teacher/entities/teacher.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Student,
            User,
            Teacher,
        ])
    ],
    controllers: [StudentController],
    providers: [StudentService, UserService],
    exports: [StudentService],
})
export class StudentModule {}
