import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/users.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { hash, compare } from "bcrypt";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService
  ) {}

  async login(loginUser: LoginAuthDto): Promise<{ access_token: string }> {

    const user = await this.usersService.findByEmail(loginUser.email);
    const checkPassword = await compare(loginUser.password, user.password)
    if (!checkPassword) {
      throw new HttpException('Password incorrect.', 400);
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    const expiration = new Date(); 
    expiration.setHours(expiration.getHours() + 6); 
    await this.tokenService.saveToken(token, expiration);

    return {
      access_token: token,
    };
  }



  
  async register(user: RegisterAuthDto) {
    const { password } = user;
    const passwordEncoder = await hash(password, 10);
    user = {...user, password:passwordEncoder}
    return  this.usersService.createUser(user);
  }

}
  

