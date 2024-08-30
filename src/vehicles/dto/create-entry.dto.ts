import { Expose, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateEntryDto {

    @Expose()
    @Transform(({ obj }) => obj.vehicle.plate)
    @IsNotEmpty()
    plate: string;

    @Expose()
    @Transform(({ obj }) => obj.parking.id)
    @IsNotEmpty()
    idParking: number;

    @Expose()
    @Transform(({ obj }) => obj.vehicle.brand)
    brand: string;

    @Expose()
    @Transform(({ obj }) => obj.vehicle.model)
    model: string;
    
    @Expose()
    @Transform(({ obj }) => obj.vehicle.color)
    color: string;
}
