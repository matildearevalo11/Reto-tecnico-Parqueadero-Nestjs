import { Module } from '@nestjs/common';
import { VehicleshistoryService } from './vehicleshistory.service';
import { VehicleshistoryController } from './vehicleshistory.controller';

@Module({
  controllers: [VehicleshistoryController],
  providers: [VehicleshistoryService],
})
export class VehicleshistoryModule {}
