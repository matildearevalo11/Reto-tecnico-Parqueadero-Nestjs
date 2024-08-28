import { forwardRef, Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehiclesModule } from 'src/vehicles/vehicles.module';
import { VehicleHistory } from 'src/vehicleshistory/entities/vehicleshistory.entity';
import { VehicleshistoryModule } from 'src/vehicleshistory/vehicleshistory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, User, VehicleHistory, Vehicle]),
    forwardRef(() => VehiclesModule),
    VehicleshistoryModule,
  ],  controllers: [ParkingsController],
  providers: [ParkingsService, UserService],
  exports: [ParkingsService]
})
export class ParkingsModule {}
