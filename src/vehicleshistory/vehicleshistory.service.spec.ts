import { Test, TestingModule } from '@nestjs/testing';
import { VehicleshistoryService } from './vehicleshistory.service';

describe('VehicleshistoryService', () => {
  let service: VehicleshistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleshistoryService],
    }).compile();

    service = module.get<VehicleshistoryService>(VehicleshistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
