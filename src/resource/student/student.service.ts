import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { UserService } from '../user/user.service';
import availableProfessionals from '../../shared/services/available-teachers';
import appointmentsMap from '../../shared/services/classes-map';
import { Proposal } from '../../shared/common/interfaces/propostal.interface';
import { Teacher } from '../teacher/entities/teacher.entity';
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private readonly userService: UserService,
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
    ) {}

    public async create(createClientDto: CreateStudentDto) {
        return await this.userService
            .create({
                ...createClientDto,
            })
            .then(async (user) => {
                const client = this.studentRepository.create({
                    ...createClientDto,
                    user: user,
                });
                return await this.studentRepository.save(client);
            });
    }
    public async findAll() {
        return await this.studentRepository.find();
    }

    public async findOne(id: string) {
        return await this.studentRepository.findOne(id);
    }

    public async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, {
            ...updateUserDto,
        });
    }

    public async remove(id: string) {
        return await this.studentRepository.delete(id);
    }

    public async findAvailable(proposal: Proposal) {
        const teacherId = availableProfessionals.getNext();
        if (!teacherId) return { error: 'no teachers available' };

        availableProfessionals.propose(teacherId, proposal);
        return { success: 'appointment proposed' };
    }

    public async getRoomName(id: string) {
        const roomName = appointmentsMap.getValue(id);
        const proposalExists = availableProfessionals.searchProposal(id);
        if (!proposalExists) return { error: 'denied proposal' };

        return !roomName ? { roomName: null } : { roomName };
    }
}
