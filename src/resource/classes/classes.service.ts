import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classes } from './entities/classes.entity';
import { TeacherSql } from '../teacher/teacher.sql';
import {TeacherAvailableDto, UpdateTeacherAvailableDto} from "./dto/teacher-avaible.dto";
import {Teacher} from "../teacher/entities/teacher.entity";
import { Cache } from 'cache-manager';
import {handleTeacherInCache, teacherCacheGet} from "../teacher/teacher.helper";
import {TeacherService} from "../teacher/teacher.service";
import {TypeTeacherAvailable} from "./classes.type";
import {CLASSES_STATUS} from "../../shared/common/enum/classes-status.enum";

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Classes)
        private readonly classesRepository: Repository<Classes>,
        @InjectRepository(Teacher)
        private readonly teacher_repo: Repository<Teacher>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly teacherService: TeacherService,
    ) {}

    public async teacherAvailable(createClassroomDto: CreateClassroomDto): TypeTeacherAvailable {
        return await this.getTeacher(createClassroomDto.teacherId).then(async()=>{
            const teacher_in_cache = await this.getTeacherStatus(createClassroomDto.teacherId);
            if(!teacher_in_cache.online && !teacher_in_cache.available) {
                throw new HttpException({
                    success: false,
                    message: 'Teacher are offline and not available',
                }, HttpStatus.PRECONDITION_FAILED);
            }
            if(teacher_in_cache.online && teacher_in_cache.available) {
                return {
                    success: true,
                    message: 'Teacher are online and available',
                };
            }
            if(teacher_in_cache.online && !teacher_in_cache.available) {
                throw new HttpException({
                    success: false,
                    message: 'Teacher are online but not available',
                }, HttpStatus.PRECONDITION_FAILED);
            }
            if(!teacher_in_cache.online && teacher_in_cache.available) {
                return {
                    success: true,
                    message: 'Teacher are offline but available',
                };
            }
        }).catch(error => error);
    };
    public async updateTeacherAvailableStatus(updateTeacherAvailableDto: UpdateTeacherAvailableDto): Promise<any> {
        return this.teacher_repo.update(updateTeacherAvailableDto.teacherId,{
            online: updateTeacherAvailableDto.online,
            available: updateTeacherAvailableDto.available,
        }).then(()=> handleTeacherInCache({
            cache: this.cache,
                updateTeacherAvailableDto: updateTeacherAvailableDto,
        })
            .then((message)=> Promise.resolve(message))
            .catch((error)=> new HttpException(error, 400))
        );
    };
    private async getTeacherStatus(teacherId: string){
        const teacherInCache = await teacherCacheGet({
            cache: this.cache,
            teacherId: teacherId
        }) as unknown as string;
        if (teacherInCache) {
            const parsed_teacher = JSON.parse(teacherInCache) as TeacherAvailableDto
            return {...parsed_teacher};
        }
        return{
            online: false,
            available: false,
        }
    }
    private async getTeacher(teacherId: string): Promise<Teacher> {
        const teacher = await this.teacherService.findOne(teacherId);
        if (!teacher) {
            throw new HttpException('Teacher not found', 404);
        }
        return teacher;
    }
    public async findClassesByTeacher(teacher_id: string) {
        return this.classesRepository.query(
            TeacherSql.findClassesByTeacher(teacher_id),
        );
    }
    public async create(createClassroomDto: CreateClassroomDto) {
        const teacherAvailable = await this.teacherAvailable({
            teacherId: createClassroomDto.teacherId,
            studentId: createClassroomDto.studentId,
        });
        if(!teacherAvailable.success){
            throw new HttpException(teacherAvailable, 400);
        }
        const classroom = this.classesRepository.create({
            ...createClassroomDto,
            teacher: createClassroomDto.teacherId,
            student: createClassroomDto.studentId,
            status: CLASSES_STATUS.IN_PROGRESS,
        });
        return await this.classesRepository.save(classroom)
            .then(async () => await this.updateTeacherAvailableStatus({
                teacherId: createClassroomDto.teacherId,
                online: true,
                available: false,
            }))
            .then(()=> classroom)
            .catch(error => new HttpException(error, 400));
    }

    public async findAll() {
        return await this.classesRepository.find();
    }
}
