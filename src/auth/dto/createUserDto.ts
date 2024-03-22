import { IsNotEmpty, IsString, IsEmail, Length, isStrongPassword, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Mobile number should not be empty' })
  @Length(10, 10, { message: 'Mobile number should be 10 chars long' })
  mobileNumber: string;

  @IsNotEmpty({message:'Username should not be empty'})
  username: string

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 1 },
    {
      message: 'Your password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 symbol letter, and 1 number.'
    })
  password: string;
}