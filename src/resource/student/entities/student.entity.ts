import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Classes } from '../../classes/entities/classes.entity';
import {UserCommon} from "../../../shared/common/entity/user.common";

@Entity({ name: 'student' })
export class Student implements UserCommon {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column({ type: 'uuid' })
    id_user: number;
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_user' })
    user: User;

    @OneToMany(() => Classes, (classes) => classes.student)
    classes: Classes[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
