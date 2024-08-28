import { Expose } from "class-transformer";

export class CreateVehicleshistoryDto {
    @Expose()
    id: number;
    @Expose()
    plate: string;
    @Expose()
    idParking: number;
    @Expose()
    entryTime: Date;

}
