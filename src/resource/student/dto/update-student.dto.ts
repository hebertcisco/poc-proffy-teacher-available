import { IsNotEmpty, IsString } from 'class-validator';
import {PartialType} from "@nestjs/swagger";
import {CreateStudentDto} from "./create-student.dto";

export class UpdateStudentDto  extends PartialType(CreateStudentDto){
    @IsString()
    @IsNotEmpty()
    name: string;
}
