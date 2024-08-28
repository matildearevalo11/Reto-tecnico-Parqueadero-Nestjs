import { PartialType } from '@nestjs/mapped-types';
import { CreateEntryDto } from './create-entry.dto';

export class UpdateVehicleDto extends PartialType(CreateEntryDto) {}
