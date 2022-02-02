import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateTeacherDto extends CreateUserDto {
    @ApiProperty({
        required: true,
        default: 'Física',
    })
    @IsString()
    @IsNotEmpty()
    teacher_type: string;
}
