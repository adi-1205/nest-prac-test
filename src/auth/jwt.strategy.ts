import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from "@nestjs/sequelize";
import { Request } from "express";
import { Strategy } from 'passport-jwt';
import { User } from "src/database/models/user.model";


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User) private readonly user: typeof User,
    ) {
        super({
            jwtFromRequest: function (req) {
                var token = null;
                if (req && req.cookies) {
                    token = req.cookies['auth'];
                }
                return token;
            },
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        const { id } = payload
        const user = await this.user.findByPk(id)
        if (!user) throw new UnauthorizedException('Unauthorized')
        return user
    }
}