import { IsNotEmpty, IsString } from 'class-validator';
import { IsEmail } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import crypto = require('crypto');

export class CreateUserDto {
    @ApiProperty({ required: true, default: `Fulano` })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: true, default: `Da Silva` })
    lastname: string;

    @ApiProperty({ required: true, default: `fulano@gmail.com` })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: true, default: `${crypto.randomUUID()}` })
    @IsString()
    @IsNotEmpty()
    password: string;
}
