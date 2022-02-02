import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateTeacherAvailableDto} from "./dto/teacher-avaible.dto";

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}

    @Post('teacher-available')
    teacherAvailable(@Body() createClassroomDto: CreateClassroomDto) {
        return this.classesService.teacherAvailable({...createClassroomDto});
    }
    @Patch('update-teacher-available')
    updateTeacherAvailableStatus(@Body() updateTeacherAvailableDto: UpdateTeacherAvailableDto) {
        return this.classesService.updateTeacherAvailableStatus({
           ...updateTeacherAvailableDto,
        });
    }
    @Get(':teacher_id/teacher')
    findClassesByTeacher(
        @Param('teacher_id') teacher_id: string,
    ) {
        return this.classesService.findClassesByTeacher(
            teacher_id,
        );
    }
    @Post()
    create(@Body() createAppointmentDto: CreateClassroomDto) {
        return this.classesService.create(createAppointmentDto);
    }

    @Get()
    findAll() {
        return this.classesService.findAll();
    }
}
