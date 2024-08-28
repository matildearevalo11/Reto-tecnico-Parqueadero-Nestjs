import { Module } from '@nestjs/common';
import { VehicleshistoryService } from './vehicleshistory.service';
import { VehicleshistoryController } from './vehicleshistory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleHistory } from './entities/vehicleshistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleHistory])],
  controllers: [VehicleshistoryController],
  providers: [VehicleshistoryService],
  exports: [VehicleshistoryService],})
  
export class VehicleshistoryModule {}
