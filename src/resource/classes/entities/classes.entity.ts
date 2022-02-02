import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import {UserCommon} from "../../../shared/common/entity/user.common";

@Entity({ name: 'classes' })
export class Classes implements UserCommon {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column({ type: 'varchar', nullable: true })
    status: string;

    @ManyToOne(() => Student, (student) => student.classes)
    student: string;

    @ManyToOne(() => Teacher, (teacher) => teacher.classes)
    teacher: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
