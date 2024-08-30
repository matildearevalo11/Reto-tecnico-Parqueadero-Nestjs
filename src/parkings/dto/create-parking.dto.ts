import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateParkingDto {
  @IsInt({ message: 'El id del socio es obligatorio.' })
  idSocio: number;

  @IsNotEmpty({ message: 'El nombre del parqueadero es obligatorio.' })
  name: string;

  @IsNotEmpty({ message: 'La dirección del parqueadero es obligatoria.' })
  address: string;

  @IsInt({ message: 'La capacidad vehicular del parqueadero no puede estar vacía.' })
  @Min(1, { message: 'La capacidad vehicular debe ser mayor a 0.' })
  vehicleCapacity: number;

  @Min(1, { message: 'El costo por hora debe ser mayor que 0.' })
  @IsNotEmpty({ message: 'El costo por hora no puede estar vacío.' })
  hourlyRate: number;
}
