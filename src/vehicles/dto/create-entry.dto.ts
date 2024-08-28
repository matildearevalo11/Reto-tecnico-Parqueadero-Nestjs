import { IsNotEmpty } from "class-validator";

export class CreateEntryDto {

    @IsNotEmpty()
    plate: string;

    @IsNotEmpty()
    idParking: number;

    brand: string;
    model: string;
    color: string;
}
