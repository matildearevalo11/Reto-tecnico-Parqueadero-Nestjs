import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';  
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from './auth.guard';
import { TokenService } from 'src/token/token.service';
import { MessageDto } from 'src/message/dto/message.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard) 
  @Roles(Role.ADMIN)
  registerUser(@Body() user: RegisterAuthDto) {
    this.authService.register(user);
    return new MessageDto('User registered.');
  }

  @Post('login')
  loginUser(@Body() user: LoginAuthDto){
    return this.authService.login(user);
  } 

  @Post('logout')
  @UseGuards(AuthGuard)
  async logoutUser(@Body('token') token: string) {
    await this.tokenService.removeToken(token);
    return new MessageDto('Logout successful');
  }
}
