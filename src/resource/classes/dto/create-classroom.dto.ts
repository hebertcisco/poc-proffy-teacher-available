import { IsNotEmpty, IsUUID } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import crypto = require('crypto');

export class CreateClassroomDto {
    @ApiProperty({
        required: true,
        default: crypto.randomUUID(),
    })
    @IsUUID()
    @IsNotEmpty()
    teacherId: string;

    @ApiProperty({
        required: true,
        default: crypto.randomUUID(),
    })
    @IsUUID()
    @IsNotEmpty()
    studentId: string;
}
