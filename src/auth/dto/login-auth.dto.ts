import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Role } from "src/roles/role.enum";

export class LoginAuthDto {
    @IsEmail()
    email: string;

    @MinLength(4)
    @MaxLength(12)
    password: string;

    role: Role;

}
