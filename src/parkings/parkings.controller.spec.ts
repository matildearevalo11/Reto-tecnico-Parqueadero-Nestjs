import { Test, TestingModule } from '@nestjs/testing';
import { ParkingsController } from './parkings.controller';
import { ParkingsService } from './parkings.service';

describe('ParkingsController', () => {
  let controller: ParkingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingsController],
      providers: [ParkingsService],
    }).compile();

    controller = module.get<ParkingsController>(ParkingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
