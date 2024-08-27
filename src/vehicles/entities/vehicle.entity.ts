import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
  import { Parking } from '../../parkings/entities/parking.entity'; 
  import { IsAlphanumeric, Length } from 'class-validator';
  
  @Entity({ name: 'vehicle' })
  export class Vehicle {
  
    @PrimaryColumn({ name: 'plate' })
    @IsAlphanumeric()
    @Length(6, 6)
    plate: string;
  
    @ManyToOne(() => Parking, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'parking_id', referencedColumnName: 'id' })
    parking: Parking;
  
    @Column({ name: 'brand', nullable: false })
    brand: string;
  
    @Column({ name: 'model', nullable: false })
    model: string;
  
    @Column({ name: 'color', nullable: false })
    color: string;
  }