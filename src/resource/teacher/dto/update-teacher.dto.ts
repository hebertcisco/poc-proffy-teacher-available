import { CreateUserDto } from '../../user/dto/create-user.dto';
import {PartialType} from "@nestjs/swagger";

export class UpdateTeacherDto extends PartialType(CreateUserDto) {
    online?: boolean;
    available?: boolean;
}
