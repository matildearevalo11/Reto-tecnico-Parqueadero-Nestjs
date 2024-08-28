import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { MessageDto } from 'src/message/dto/message.dto';

@Controller('parkings')
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @Post()
  create(@Body() createParkingDto: CreateParkingDto, idSocio: number) {
    return this.parkingsService.create(createParkingDto, idSocio);
  }

  @Get()
  findAll() {
    return this.parkingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingDto: UpdateParkingDto) {
    return this.parkingsService.update(+id, updateParkingDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.parkingsService.remove(+id);
  }

  @Get('/earnings-for-day/:idParking')
  async getEarningsDay(@Param('idParking') idParking: number) {
      const earnings = await this.parkingsService.calculateEarningsDay(idParking);
      return new MessageDto(`Earnings for day:  ${earnings}`)
  }

  @Get("/earnings-for-month/:idParking")
  async getEarningsMonth(@Param('idParking') idParking: number) {
    const earnings = await this.parkingsService.calculateEarningsMonth(idParking);
    return new MessageDto(`Earnings for month:  ${earnings}`)
  }

  @Get("/earnings-for-year/:idParking")
  async getEarningsYear(@Param('idParking') idParking: number) {
    const earnings = await this.parkingsService.calculateEarningsYear(idParking);
    return new MessageDto(`Earnings for year:  ${earnings}`)
  }
}
