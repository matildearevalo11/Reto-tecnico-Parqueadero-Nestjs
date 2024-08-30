import { Module } from '@nestjs/common';
import { VehicleshistoryService } from './vehicleshistory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleHistory } from './entities/vehicleshistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleHistory])],
  providers: [VehicleshistoryService],
  exports: [VehicleshistoryService],})
  
export class VehicleshistoryModule {}
