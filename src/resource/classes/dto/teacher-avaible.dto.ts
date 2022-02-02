import { CreateClassroomDto } from './create-classroom.dto';
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, IsUUID} from "class-validator";
import crypto = require('crypto');

export class TeacherAvailableDto extends PartialType(CreateClassroomDto) {
    @ApiProperty({
        required: true,
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    online: boolean;

    @ApiProperty({
        required: true,
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    available: boolean;
}
export class UpdateTeacherAvailableDto {
    @ApiProperty({
        required: true,
        default: crypto.randomUUID(),
    })
    @IsUUID()
    @IsNotEmpty()
    teacherId: string;

    @ApiProperty({
        required: true,
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    online: boolean;

    @ApiProperty({
        required: true,
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    available: boolean;
}