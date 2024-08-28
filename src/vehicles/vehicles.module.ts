import { forwardRef, Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from 'src/parkings/entities/parking.entity';
import { VehicleHistory } from 'src/vehicleshistory/entities/vehicleshistory.entity';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingsModule } from 'src/parkings/parkings.module';
import { VehicleshistoryModule } from 'src/vehicleshistory/vehicleshistory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleHistory, Vehicle, Parking]),
    VehicleshistoryModule, 
    forwardRef(() => ParkingsModule), 
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
