import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Render, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { SignInDto } from './dto/signInDto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('signup')
  @Render('auth/signup')
  getViewSignUp() {
    return
  }

  @Get('signin')
  @Render('auth/signin')
  getViewSignIn() {
    return
  }

  @Get('signout')
  async signout(
    @Res() res: Response,
    @Req() req: Request
  ) {
    res.cookie('auth', '')
    req.session.destroy(err => {
      console.log(err);
    })

    res.redirect('/auth/signin')
    return
  }


  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() user: CreateUserDto) {
    return await this.authService.signup(user)
  }

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signin(
    @Body() user: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    return await this.authService.signin(res, req, user)
  }
}
