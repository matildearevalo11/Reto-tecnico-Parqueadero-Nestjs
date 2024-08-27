import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  registerUser(@Body() createUserDto: RegisterAuthDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(){
    return 'hola';
  }

  

}
