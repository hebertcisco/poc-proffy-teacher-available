import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Controller('student')
export class StudentController {
    constructor(private readonly clientService: StudentService) {}

    @Post()
    create(@Body() createClientDto: CreateStudentDto) {
        return this.clientService.create(createClientDto);
    }

    @Get(':id/proposals')
    findAcceptedProposals(@Param('id') id: string) {
        return this.clientService.getRoomName(id);
    }

    @Patch(':id/propose')
    proposeAppointment(
        @Param('id') id: string,
        @Body() createProposalDto: CreateProposalDto,
    ) {
        return this.clientService.findAvailable({
            clientId: id,
            ...createProposalDto,
        });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateClientDto: UpdateStudentDto) {
        return this.clientService.update(id, updateClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientService.remove(id);
    }
}
