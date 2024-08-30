import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';  
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('save-entry')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SOCIO)
  @HttpCode(HttpStatus.CREATED)
  saveEntry(@Body() createEntryDto: CreateEntryDto, @CurrentUser() usuarioActual: any, 
     ) {
       const idUsuario = usuarioActual.id;
       return this.vehiclesService.saveEntry(createEntryDto, idUsuario);
     }

  @Post('save-output')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SOCIO)
  saveOutput(@Body('plate') plate: string) {
       return this.vehiclesService.saveOutput(plate);
     }

  @Get('plate-coincidence/:plateCoincidence')
  @Roles(Role.ADMIN, Role.SOCIO)
  findPlateCoincidence(@Param('plateCoincidence') plateCoincidence: string) {
    return this.vehiclesService.findPlateCoincidence(plateCoincidence);
  }

  @Get('/detail/:id')
  @Roles(Role.ADMIN)
  getDetail(@Param('id') idParking: number) {
    return this.vehiclesService.getDetail(idParking);
  }

  @Get(':id')
  @Roles(Role.SOCIO)
  findAll(@Param('id') idParking: number) {
    return this.vehiclesService.findAll(idParking);
  }

 

}
