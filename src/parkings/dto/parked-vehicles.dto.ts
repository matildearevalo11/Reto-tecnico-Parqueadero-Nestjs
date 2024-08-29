import { Expose, Transform } from "class-transformer";

export class ParkedVehiclesDto {
  @Expose()
  @Transform(({ obj }) => obj.vehicle.plate)
  plate: string;
  @Expose()
  entryTime: Date;
}

