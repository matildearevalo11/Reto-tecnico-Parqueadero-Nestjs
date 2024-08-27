import { Injectable } from '@nestjs/common';
import { CreateVehicleshistoryDto } from './dto/create-vehicleshistory.dto';
import { UpdateVehicleshistoryDto } from './dto/update-vehicleshistory.dto';

@Injectable()
export class VehicleshistoryService {
  create(createVehicleshistoryDto: CreateVehicleshistoryDto) {
    return 'This action adds a new vehicleshistory';
  }

  findAll() {
    return `This action returns all vehicleshistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicleshistory`;
  }

  update(id: number, updateVehicleshistoryDto: UpdateVehicleshistoryDto) {
    return `This action updates a #${id} vehicleshistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicleshistory`;
  }
}
