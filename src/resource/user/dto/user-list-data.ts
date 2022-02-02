import { IsString } from 'class-validator';

export class UserListDataDto {
    @IsString()
    limit: number;
}
