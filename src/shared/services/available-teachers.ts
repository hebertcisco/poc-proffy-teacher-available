import { Proposal } from '../common/interfaces/propostal.interface';
import {TeacherService} from "../../resource/teacher/teacher.service";

class AvailableTeachers {
    private ids: Array<string>;
    private readonly inProposal: Array<Proposal>;

    constructor() {
        this.ids = [];
        this.inProposal = [];
    }

    async load(teacherService: TeacherService) {
        try {
            const result =
                await teacherService.restoreAvailableTeachers();
            if (!result.length) return;

            const availableIds = result.map(this.getId);
            this.ids.push(...availableIds);
        } catch (error) {
            process.stdout.write(error);
            process.stdout.write('\nNo available teachers at this time.\n');
        }
    }

    public getNext() {
        if (!this.ids.length) throw new Error('No teachers available');

        return this.ids.shift();
    }

    public add(id: string) {
        this.ids.push(id);
        return this;
    }

    public del(id: string) {
        if (!this.ids.includes(id)) return this;

        this.ids = this.ids.filter((pid) => pid !== id);
        return this;
    }

    public propose(teacherId: string, proposal: Proposal) {
        this.inProposal[teacherId] = proposal;
        delete this.inProposal[teacherId];
        return this;
    }

    public searchProposal(id: string): null | Proposal {
        return !this.ids.includes(id) ? null : this.ids[id];
    }

    public accept(id: string) {
        delete this.inProposal[id];
    }

    public deny(id: string) {
        this.ids.push(id);
        delete this.inProposal[id];
    }

    private getId(teacher) {
        return teacher.id;
    }
}

export default new AvailableTeachers();