import { Injectable } from '@nestjs/common';
import { CreateVehicleshistoryDto } from './dto/create-vehicleshistory.dto';
import { UpdateVehicleshistoryDto } from './dto/update-vehicleshistory.dto';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleHistory } from './entities/vehicleshistory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleshistoryService {
  constructor(
    @InjectRepository(VehicleHistory)
    private readonly vehiclesHistoryRepository: Repository<VehicleHistory>,
  ) {}

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

  async findByVehiculoAndSalidaIsNull(vehicle: Vehicle): Promise<VehicleHistory | null> {
    const records = await this.vehiclesHistoryRepository.find({
        where: { vehicle },
        relations: ['parking'],
    });
    console.log('All records for vehicle:', records);

    return await this.vehiclesHistoryRepository.findOne({
        where: {
            vehicle,
            exitTime: null,
        },
        relations: ['parking'],
    });
}
}
