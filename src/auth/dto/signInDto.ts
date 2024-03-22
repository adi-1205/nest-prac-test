import { IsNotEmpty, IsString, IsEmail, Length, isStrongPassword, IsStrongPassword } from 'class-validator';

export class SignInDto {
    @IsNotEmpty({ message: 'Mobile number should not be empty' })
    mobileNumber: string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
}