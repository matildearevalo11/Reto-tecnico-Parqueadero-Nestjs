import { Expose } from "class-transformer";
import { Role } from "src/roles/role.enum";

export class GetUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;
  
  @Expose()
  role: Role;

}
