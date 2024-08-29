import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/role.enum';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  role: Role;
}
