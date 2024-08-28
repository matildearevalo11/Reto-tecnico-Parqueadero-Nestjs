import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';  
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateVehicleshistoryDto } from 'src/vehicleshistory/dto/create-vehicleshistory.dto';
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

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
