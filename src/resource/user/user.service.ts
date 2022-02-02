import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt = require('bcryptjs');
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import { UserSessionsDto } from './dto/user-sessions.dto';
import { AuthResponse, TUserList } from './user.type';
import { Response } from 'express';
import { UserSQL } from './user.sql';
import { UserListDataDto } from './dto/user-list-data';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly user_repo: Repository<User>,
    ) {}
    public async findOne(id: string): Promise<User> {
        return await this.user_repo.findOne(id);
    }
    public async create(createUserDto: CreateUserDto, res?: Response) {
        const passwordHash = await bcrypt.hash(createUserDto.password, 8).catch((error)=>{
            process.stdout.write(error);
            throw new HttpException('Error hashing password', HttpStatus.INTERNAL_SERVER_ERROR);
        });
        const user = this.user_repo.create({
            ...createUserDto,
            password: passwordHash,
        });
        return await this.user_repo
            .save(user)
            .then(async (user) => {
                return user;
            })
            .catch((err) => {
                throw new HttpException(
                    err,
                    HttpStatus.BAD_REQUEST,
                );
            });
    }
    async auth(userSessionsDto: UserSessionsDto): Promise<AuthResponse> {
        const user = await this.user_repo.findOne({
            where: {
                email: userSessionsDto.email,
            },
        });

        return new Promise(async (resolve, reject) => {
            if (!user) {
                return reject(
                    new HttpException(
                        'Usuário não encontrado',
                        HttpStatus.NOT_FOUND,
                    ),
                );
            }

            const passwordMatched = await bcrypt.compare(
                userSessionsDto.password,
                user.password,
            );

            if (!passwordMatched) {
                return reject(
                    new HttpException(
                        'Senha inválida',
                        HttpStatus.UNAUTHORIZED,
                    ),
                );
            }

            const token = jwt.sign({ id: user.id }, process.env.APP_SECRET || '', {
                expiresIn: '1d',
            });

            return resolve({
                token,
                user,
            });
        });
    }
    public async update(id: string, updateUserDto: UpdateUserDto) {
        return  this.user_repo.update(
            { id: id },
            {
                ...updateUserDto,
                password: await bcrypt.hash(updateUserDto.password, 8),
            },
        );
    }
}
