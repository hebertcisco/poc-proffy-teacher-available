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
import { Classes} from '../../classes/entities/classes.entity';
import {UserCommon} from "../../../shared/common/entity/user.common";

@Entity({ name: 'teacher' })
export class Teacher implements UserCommon {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;

    @Column({ type: 'uuid', })
    id_user: string;
    @OneToOne(() => User, (user) => user.id,{
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @Column({ type: 'boolean', name: 'online', default: false })
    online: boolean;

    @Column({ type: 'boolean', name: 'available', default: false })
    available: boolean;

    @OneToMany(() => Classes, (classes) => classes.teacher)
    classes: Classes[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
