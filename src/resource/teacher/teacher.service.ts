import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { UserService } from '../user/user.service';
import availableTeachers from '../../shared/services/available-teachers';
import appointmentsMap from '../../shared/services/classes-map';
import { TeacherSql } from './teacher.sql';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacher_repo: Repository<Teacher>,
        private readonly userService: UserService,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}
    public async findClassesByTeacher(teacher_id: string) {
        return this.studentRepository.query(
            TeacherSql.findClassesByTeacher(teacher_id),
        );
    }
    public async create(createTeacherDto: CreateTeacherDto) {
        if (
            !createTeacherDto.teacher_type
        ) {
            throw new HttpException(
                'Teacher and type are required',
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.userService
            .create({
                ...createTeacherDto,
            })
            .then(async (user) => {
                const teacher = this.teacher_repo.create({
                    ...createTeacherDto,
                    user
                });
                return await this.teacher_repo.save(teacher);
            });
    }

    public async findOne(id_teacher: string) {
        const teacher = await this.teacher_repo.query(
            TeacherSql.findOne(id_teacher),
        );
        if (teacher.length === 0) {
            throw new HttpException(
                'Professional not found',
                HttpStatus.NOT_FOUND,
            );
        }

        return teacher[0];
    }

    public async update(
        id: string,
        updateTeacherDto: UpdateTeacherDto,
    ) {
        const teacher = await this.teacher_repo.findOne(id);

        if (teacher.online && !updateTeacherDto.online) {
            availableTeachers.del(id);
            updateTeacherDto.available = false;
        }

        if (!teacher.online && updateTeacherDto.online) {
            availableTeachers.add(id);
            updateTeacherDto.available = true;
        }

        if (teacher.online && updateTeacherDto.available) {
            availableTeachers.add(id);
        }

        if (teacher.online && !updateTeacherDto.available) {
            availableTeachers.del(id);
        }

        return await this.userService.update(id, {
            ...updateTeacherDto,
        });
    }

    public async remove(id: string) {
        return this.teacher_repo.delete(id);
    }

    public async searchNewProposals(id: string) {
        const proposal = availableTeachers.searchProposal(id);
        if (!proposal) return { clientId: null };

        return proposal;
    }

    public async acceptProposal(id: string) {
        const roomName = appointmentsMap.create(id);
        availableTeachers.accept(id);
        await this.update(id, { available: false });
        return { roomName };
    }

    public denyProposal(id: string) {
        availableTeachers.deny(id);
    }

    public async restoreAvailableTeachers() {
        return this.teacher_repo.find({
            select: ['id'],
            where: { online: true, available: true },
        });
    }
}
