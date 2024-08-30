import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@UseGuards(AuthGuard, RolesGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  registerUser(@Body() createUserDto: RegisterAuthDto) {
    return this.usersService.createUser(createUserDto);
  }
  
  @Get("/partner/parkings")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SOCIO)
  getParkingsUser(@CurrentUser() idUser: any) {
    const id = idUser.id;
    return this.usersService.getParkingsByPartner(id);
  }

  @Get("/partners")
  @Roles(Role.ADMIN)
  getPartners() {
    return this.usersService.partners();
  }

  

}
