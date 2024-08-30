import { PartialType } from "@nestjs/mapped-types";
import { CreateEntryDto } from "./create-entry.dto";
import { Expose } from "class-transformer";

export class GetDetailDto extends PartialType(CreateEntryDto){
  @Expose()
  entryTime: Date;
}