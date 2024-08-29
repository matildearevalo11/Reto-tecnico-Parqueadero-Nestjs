import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { Role } from 'src/roles/role.enum';
import { UserService } from 'src/users/users.service';
import { GetParkingDto } from './dto/get-parking.dto';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { VehicleHistory } from 'src/vehicleshistory/entities/vehicleshistory.entity';
import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { VehicleshistoryService } from 'src/vehicleshistory/vehicleshistory.service';
import { ParkedVehiclesDto } from './dto/parked-vehicles.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,
    @InjectRepository(VehicleHistory)
    private vehicleHistoryRepository: Repository<VehicleHistory>,
    private vehicleHistoryService: VehicleshistoryService,
    private userService: UserService,
    @Inject(forwardRef(() => VehiclesService))
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

  calcularCostoParqueadero(entryTime: Date, exitTime: Date, hourlyRate: number) {
    if (!exitTime) {
      throw new ConflictException('El vehículo aún sigue en el parqueadero');
    }
    if (!entryTime || hourlyRate == null) {
      throw new Error('La entrada, salida o costo por hora no pueden ser null');
    }

    const minutes = Math.floor((+exitTime - +entryTime) / 60000);
    const hours = Math.ceil(minutes / 60);
    return hours * hourlyRate;
  }

  async calculateEarningsPeriod(dateStart: Date, dateFinish: Date, idParking: number) {
    const parking = await this.parkingRepository.findOne({where: {id : idParking}})
    if(!parking){
      throw new NotFoundException('Parking not found.')
    }
    const historicals = await this.vehicleHistoryRepository.find({
      where: {
        parking: { id: idParking },
        entryTime: Between(dateStart, dateFinish),
        exitTime: Not(IsNull())
      }
    });  
    const totalEarnings = historicals.reduce((total, history) => {
      const earnings = typeof history.total === 'number' ? history.total : parseFloat(history.total as unknown as string) || 0;
      return total + earnings;
    }, 0);

    return totalEarnings;
  }

  async calculateEarningsDay(idParking: number){
    const parking = await this.parkingRepository.findOne({where: {id: idParking}})
    if(!parking){
      throw new NotFoundException('Parking not found.')
    }
    const now = new Date();
    const startDay = startOfDay(now);
    const endDay = endOfDay(now);

    return this.calculateEarningsPeriod(startDay, endDay, parking.id);
  }

  async calculateEarningsMonth(idParking: number) {
    const parking = await this.parkingRepository.findOne({where: {id: idParking}})
    if(!parking){
      throw new NotFoundException('Parking not found.')
    }
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);

    return this.calculateEarningsPeriod(startMonth, endMonth, parking.id);
  }

  async calculateEarningsYear(idParking: number) {
    const parking = await this.parkingRepository.findOne({where: {id: idParking}})
    if(!parking){
      throw new NotFoundException('Parking not found.')
    }
    const now = new Date();
    const startYear = startOfYear(now);
    const endYear = endOfYear(now);

    return this.calculateEarningsPeriod(startYear, endYear, parking.id);
  }

  async vehiclesMostRegistered(){
    return await this.vehicleHistoryService.findVehiclesMostRegistered()
  }

  async vehiclesMostRegisteredByParking(idParking: number){
    return await this.vehicleHistoryService.findVehiclesMostRegisteredByParking(idParking)
  }

  async firstTimeEntriesByParking(idParking: number){
    const vehicles= await this.vehicleHistoryService.findVehiclesExitIsNull(idParking)

    if(!vehicles){
      throw new NotFoundException('There are no parked vehicles.')
    }    
    const firstTimeEntries = await Promise.all(
      vehicles.map(async (v) => {
        const count = await this.vehicleHistoryService.countEntriesByPlateAndParking(v.vehicle.plate, idParking);
        return count === 1 ? v : null;
      })
    );
    const vehiclesFirstTime = firstTimeEntries.filter(v => v !== null);
    const mappedVehicles = plainToInstance(ParkedVehiclesDto, vehiclesFirstTime);
    console.log(mappedVehicles)
    return mappedVehicles
    .map(vehicle => ({
      plate: vehicle.plate,
      entryTime: vehicle.entryTime,
    }));
  }
}