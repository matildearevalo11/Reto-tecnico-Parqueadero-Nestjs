import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehicleshistoryService } from './vehicleshistory.service';
import { CreateVehicleshistoryDto } from './dto/create-vehicleshistory.dto';

@Controller('vehicleshistory')
export class VehicleshistoryController {
  constructor(private readonly vehicleshistoryService: VehicleshistoryService) {}

  @Post()
  create(@Body() createVehicleshistoryDto: CreateVehicleshistoryDto) {
    return this.vehicleshistoryService.create(createVehicleshistoryDto);
  }

  @Get()
  findAll() {
    return this.vehicleshistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleshistoryService.findOne(+id);
  }
}
