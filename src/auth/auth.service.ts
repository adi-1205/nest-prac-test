import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';
import { CreateUserDto } from './dto/createUserDto';
import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/enums/roles.enum';
import { SignInDto } from './dto/signInDto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User) private UserModel: typeof User, private jwtService: JwtService) {

    }

    async signup(user: CreateUserDto) {
        let existingUser = await this.UserModel.findOne({ where: { mobile_number: user.mobileNumber } })
        if (existingUser) {
            throw new BadRequestException('Mobile already exists')
        }
        const newUser = await this.UserModel.create({
            mobile_number: user.mobileNumber,
            password: bcryptjs.hashSync(user.password, 10),
            role: user.mobileNumber == '0000000000' ? Role.Admin : Role.User,
            username: user.username
        });
        return {
            success: true,
            id: newUser.dataValues.id
        };
    }
    async signin(res: Response, req: Request, user: SignInDto) {
        let existingUser = await this.UserModel.findOne({ where: { mobile_number: user.mobileNumber } })

        if (!existingUser) {
            throw new BadRequestException('User does not exist')
        }
        let isMatch = bcryptjs.compareSync(user.password, existingUser.password)

        if (!isMatch) {
            throw new BadRequestException('Invalid credentials')
        }

        let token = this.jwtService.sign({
            id: existingUser.id,
        }, {
            secret: process.env.JWT_SECRET
        })

        res.cookie('auth', token)
        req.session['user'] = existingUser
        return {
            success: true,
            token,
            redirect: existingUser.role == Role.Admin ? '/admin/create-product' : '/products/view'
        };
    }
}
