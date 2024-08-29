import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { IsNull, Repository } from 'typeorm';
import { VehicleHistory } from 'src/vehicleshistory/entities/vehicleshistory.entity';
import { Parking } from 'src/parkings/entities/parking.entity';
import { CreateVehicleshistoryDto } from 'src/vehicleshistory/dto/create-vehicleshistory.dto';
import { plainToInstance } from 'class-transformer';
import { VehicleshistoryService } from 'src/vehicleshistory/vehicleshistory.service';
import { ParkingsService } from 'src/parkings/parkings.service';
import { MessageDto } from 'src/message/dto/message.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleHistory)
    private vehicleHistoryRepository: Repository<VehicleHistory>,
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
    private vehicleHistoryService: VehicleshistoryService,
    @Inject(forwardRef(() => ParkingsService))
    private parkingService: ParkingsService,
  ) {}


  findAll() {
    return `This action returns all vehicles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  async saveEntry(createEntryDto: CreateEntryDto, id: number){
    const vehiculoOptional = await this.vehicleRepository.findOne({
      where: { plate: createEntryDto.plate }});

    if (!vehiculoOptional) {
        throw new NotFoundException('Vehicle not found.');
    }

    const historialActualOptional = await this.vehicleHistoryRepository.findOne({
        where: {
            vehicle: vehiculoOptional,
            exitTime: IsNull()  
        }
    });

    if (historialActualOptional) {
        throw new ConflictException('No se puede registrar ingreso, ya existe una entrada activa para este vehículo.');
    }

    const parking = await this.parkingRepository.findOne({
      where: { id: createEntryDto.idParking },
      relations: ['user'],
    });

    if (!parking) {
      throw new NotFoundException('Parking not found.');
    }

    if (parking.user.id !== id) {
      throw new ConflictException('Este socio no puede añadir entradas a parqueaderos que no tiene a cargo.');
    }

    const totalVehiculos = await this.vehicleHistoryRepository.count({
      where: { parking: { id: parking.id }, exitTime: null },
    });

    if (totalVehiculos >= parking.vehicleCapacity) {
      throw new ConflictException('El parqueadero está lleno. No se puede registrar más vehículos.');
    }

    let vehicle = vehiculoOptional || new Vehicle();
    vehicle.plate = createEntryDto.plate;
    vehicle.brand = createEntryDto.brand;
    vehicle.model = createEntryDto.model;
    vehicle.color = createEntryDto.color;
    vehicle.parking = parking;
    vehicle = await this.vehicleRepository.save(vehicle);

    let historial = new VehicleHistory();
    historial.vehicle = vehicle;
    historial.parking = parking;
    historial.entryTime = new Date(); 
    historial.exitTime = null;
    historial.total = 0;
    historial = await this.vehicleHistoryRepository.save(historial);

    const history= plainToInstance(CreateVehicleshistoryDto, historial);
    return { id: history.id }; ;
  }

  async saveOutput(plate: string){
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate },
      relations: ['parking'],});
    if(!vehicle){
      throw new NotFoundException('Vehicle not found.')
    }

    const historial = await this.vehicleHistoryService.findByVehiculoAndSalidaIsNull(vehicle);
       if (historial.exitTime) {
         throw new NotFoundException(`No se encontró un registro de entrada activo para el vehículo con placa ${historial.vehicle.plate}`);
       }
       historial.exitTime = new Date(); 
       const hourlyRate = historial.parking.hourlyRate;
       const total = this.parkingService.calcularCostoParqueadero(historial.entryTime, historial.exitTime, hourlyRate);
       historial.total = total;

       await this.vehicleHistoryRepository.save(historial);
       return new MessageDto('Exit registered.')
}

async findPlateCoincidence(plateCoincidence: string): Promise<any> {
  const results = await this.vehicleRepository.createQueryBuilder('v')
    .select('v.plate', 'plate')
    .where('v.plate LIKE :plate', { plate: `%${plateCoincidence}%` })
    .getRawMany();
  console.log(results)
  return results;
}

}
