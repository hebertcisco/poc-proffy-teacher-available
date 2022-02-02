import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, Put,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
    ) {}
    @Get(':teacher_id/classes')
    findAppointmentsByProfessional(
        @Param('teacher_id') teacher_id: string,
    ) {
        return this.teacherService.findClassesByTeacher(
            teacher_id,
        );
    }
    @Post()
    create(@Body() createProfessionalDto: CreateTeacherDto) {
        return this.teacherService.create(createProfessionalDto);
    }

    @Get(':id/proposals')
    searchNewProposals(@Param('id') id: string) {
        return this.teacherService.searchNewProposals(id);
    }

    @Patch(':id/accept')
    acceptProposal(@Param('id') id: string) {
        return this.teacherService.acceptProposal(id);
    }

    @Patch(':id/deny')
    denyProposal(@Param('id') id: string) {
        return this.teacherService.denyProposal(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateProfessionalDto: UpdateTeacherDto,
    ) {
        return this.teacherService.update(id, updateProfessionalDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teacherService.remove(id);
    }
}
