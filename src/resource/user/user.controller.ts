import {
    Controller,
    Post,
    Body,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserSessionsDto } from './dto/user-sessions.dto';
import { AuthResponse } from './user.type';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('sessions')
    public async auth(
        @Body() userSessionsDto: UserSessionsDto,
        @Res() res: Response,
    ): Promise<void> {
        return await this.userService
            .auth(userSessionsDto)
            .then((result: AuthResponse) => {
                res.status(HttpStatus.CREATED);
                res.json(result);
            })
            .catch((err) => Promise.reject(err));
    }
}
