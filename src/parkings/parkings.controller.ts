import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { MessageDto } from 'src/message/dto/message.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard, RolesGuard) 
@Controller('parkings')
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createParkingDto: CreateParkingDto, idSocio: number) {
    return this.parkingsService.create(createParkingDto, idSocio);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.parkingsService.findAll();
  }

  @Get('/10-most-registered')
  @Roles(Role.ADMIN, Role.SOCIO)
  async getVehiclesMostRegistered(){
    const mostRegistered = await this.parkingsService.vehiclesMostRegistered();
    return mostRegistered;
  } 

  @Get('/10-most-registered/:id')
  @Roles(Role.ADMIN, Role.SOCIO)
  async getVehiclesMostRegisteredByParking(@Param('id') id: number){
    const mostRegistered = await this.parkingsService.vehiclesMostRegisteredByParking(+id);
    return mostRegistered;
  } 

  @Get('/first-time-entries/:id')
  @Roles(Role.ADMIN, Role.SOCIO)
  async firstTimeEntriesByParking(@Param('id') id: number){
    const firstTimeEntries = await this.parkingsService.firstTimeEntriesByParking(+id);
    return firstTimeEntries;
  } 

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.parkingsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateParkingDto: UpdateParkingDto) {
    return this.parkingsService.update(+id, updateParkingDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.parkingsService.remove(+id);
  }

  @Get('/earnings-for-day/:idParking')
  @Roles(Role.SOCIO)
  async getEarningsDay(@Param('idParking') idParking: number) {
      const earnings = await this.parkingsService.calculateEarningsDay(idParking);
      return new MessageDto(`Earnings for day:  ${earnings}`)
  }

  @Get("/earnings-for-month/:idParking")
  @Roles(Role.SOCIO)
  async getEarningsMonth(@Param('idParking') idParking: number) {
    const earnings = await this.parkingsService.calculateEarningsMonth(idParking);
    return new MessageDto(`Earnings for month:  ${earnings}`)
  }

  @Get("/earnings-for-year/:idParking")
  @Roles(Role.SOCIO)
  async getEarningsYear(@Param('idParking') idParking: number) {
    const earnings = await this.parkingsService.calculateEarningsYear(idParking);
    return new MessageDto(`Earnings for year:  ${earnings}`)
  } 
}
