import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleshistoryDto } from './create-vehicleshistory.dto';

export class UpdateVehicleshistoryDto extends PartialType(CreateVehicleshistoryDto) {}
