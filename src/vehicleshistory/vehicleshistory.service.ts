import { Injectable } from '@nestjs/common';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleHistory } from './entities/vehicleshistory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class VehicleshistoryService {
  constructor(
    @InjectRepository(VehicleHistory)
    private vehiclesHistoryRepository: Repository<VehicleHistory>,
  ) {}

  async findByVehiculoAndSalidaIsNull(vehicle: Vehicle): Promise<VehicleHistory | null> {
    const records = await this.vehiclesHistoryRepository.find({
        where: { vehicle },
        relations: ['parking'],
    });

    return await this.vehiclesHistoryRepository.findOne({
        where: {
            vehicle,
            exitTime: null,
        },
        relations: ['parking'],
    });
  }

  async findVehiclesMostRegistered(): Promise<any[]> {
    return this.vehiclesHistoryRepository.createQueryBuilder('h')
      .select('h.vehicle.plate', 'plate')
      .addSelect('COUNT(h.id)', 'count')
      .groupBy('h.vehicle.plate')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async findVehiclesMostRegisteredByParking(idParking: number): Promise<any[]> {
    return this.vehiclesHistoryRepository
      .createQueryBuilder('h')
      .select('h.vehicle.plate', 'plate')
      .addSelect('COUNT(h.id)', 'count')
      .where('h.parking.id = :idParking', { idParking })
      .groupBy('h.vehicle.plate')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async countEntriesByPlateAndParking(plate: string, idParking: number): Promise<number> {
    const count = await this.vehiclesHistoryRepository
      .createQueryBuilder('h')
      .where('h.vehicle.plate = :plate', { plate })
      .andWhere('h.parking.id = :idParking', { idParking })
      .getCount();

      return count === 1 ? count : 0;
  }

  async findVehiclesByParking(idParking: number) {
    console.log('ID del Parqueadero:', idParking);

    const vehicles = await this.vehiclesHistoryRepository.find({
      where: {
        parking: { id: idParking },
        exitTime: IsNull(),
      },
      relations: ['parking'],
    });
  
    return vehicles;
  }
 
  async findVehiclesExitIsNull(){
    const vehicles = await this.vehiclesHistoryRepository.find({
      where: {
          exitTime: IsNull(),
      },
      relations: ['parking'],
    });
    return vehicles;
  }
}
