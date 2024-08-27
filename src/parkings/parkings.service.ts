import { Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/role.enum';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { ConflictException } from 'src/exceptions/conflict.exception';
import { UserService } from 'src/users/users.service';
import { GetParkingDto } from './dto/get-parking.dto';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleHistory } from 'src/vehicleshistory/entities/vehicleshistory.entity';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
    @InjectRepository(VehicleHistory)
    private vehicleHistoryRepository: Repository<Vehicle>,
    private userService: UserService,
    private vehicleService: VehiclesService
  ) {}

  async create(createParkingDto: CreateParkingDto, idSocio: number) {
    const socio = await this.userService.findOne(idSocio);

    if (!socio) {
      throw new NotFoundException(`Socio con el id ${idSocio} no encontrado`);
    }

    if (socio.role !== Role.ADMIN) {
      const parking = new Parking();
      parking.name = createParkingDto.name;
      parking.address = createParkingDto.address;
      parking.vehicleCapacity = createParkingDto.vehicleCapacity;
      parking.hourlyRate = createParkingDto.hourlyRate;
      parking.user = socio;

      await this.parkingRepository.save(parking); 
      return { id: parking.id }; 
    } else {
      throw new ConflictException('Un admin no puede tener un parqueadero asociado.');
    }
  }

  async findAll() {
    return await this.parkingRepository.find()
  }


  async findOne(id: number): Promise<GetParkingDto> {
    const parking = await this.parkingRepository.findOne({where: { id }, relations: ['user'],});
    if (!parking) {
        throw new NotFoundException(`Id parking ${id} not found`);
    }
    return this.mapParkingToDTO(parking);
}

  async update(id: number, updateParkingDto: UpdateParkingDto) {
    const parking = await this.parkingRepository.findOne({where: { id }, relations: ['user'],})
    if(!parking){
      throw new NotFoundException("Parking not found")
    }
    parking.name = updateParkingDto.name;
    parking.user.id = updateParkingDto.idSocio;
    parking.address = updateParkingDto.address;
    const totalVehicles = await this.countVehiclesByParking(id);
    if (updateParkingDto.vehicleCapacity >= totalVehicles) {
      parking.vehicleCapacity = updateParkingDto.vehicleCapacity;
    } else {
      throw new ConflictException('La capacidad vehicular es menor a la cantidad actual de vehículos parqueados.');
    }
    parking.hourlyRate = updateParkingDto.hourlyRate;

    await this.parkingRepository.save(parking);
    return this.mapParkingToDTO(parking);
     
  }

  async remove(id: number){
    const parking = await this.parkingRepository.findOne({where: { id }, relations: ['user'],})
    if(!parking){
      throw new NotFoundException("Parking not found")
    }
    const vehicleCount = await this.countVehiclesByParking(id);

    if(vehicleCount > 0){
      throw new ConflictException("No puede eliminar un parqueadero con vehiculos parqueados")
    }
    this.parkingRepository.delete(id)
  }

  private mapParkingToDTO(parking: Parking): GetParkingDto {
    console.log(parking)
    return {
      id: parking.id,
      idSocio: parking.user.id,
      name: parking.name,
      address: parking.address,
      vehicleCapacity: parking.vehicleCapacity,
      hourlyRate: parking.hourlyRate,
    };
  }

  async countVehiclesByParking(parkingId: number): Promise<number> {
    const count = await this.vehicleHistoryRepository.createQueryBuilder('vh')
      .innerJoin('vh.vehicle', 'v')
      .where('vh.parking.id = :parkingId', { parkingId })
      .andWhere('vh.exitTime IS NULL') 
      .getCount();

    return count;
  }
}
