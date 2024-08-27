import { Test, TestingModule } from '@nestjs/testing';
import { VehicleshistoryController } from './vehicleshistory.controller';
import { VehicleshistoryService } from './vehicleshistory.service';

describe('VehicleshistoryController', () => {
  let controller: VehicleshistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleshistoryController],
      providers: [VehicleshistoryService],
    }).compile();

    controller = module.get<VehicleshistoryController>(VehicleshistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
