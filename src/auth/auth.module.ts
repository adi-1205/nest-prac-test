import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1d'
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JwtService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
  exports: [AuthModule]
})
export class AuthModule { }
