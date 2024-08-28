import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  } from 'typeorm';
  import { Parking } from '../../parkings/entities/parking.entity'; 
  import { Vehicle } from '../../vehicles/entities/vehicle.entity'; 
  
  @Entity({ name: 'vehicles_history' })
  export class VehicleHistory {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Parking, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parking_id', referencedColumnName: 'id' })
    parking: Parking;
  
    @ManyToOne(() => Vehicle, { nullable: false, eager: true })
    @JoinColumn({ name: 'vehicle_plate', referencedColumnName: 'plate' })
    vehicle: Vehicle;
  
    @Column({ name: 'entryTime', type: 'timestamp', nullable: false })
    entryTime: Date; 
  
    @Column({ name: 'exitTime', type: 'timestamp', nullable: true })
    exitTime: Date;
  
    @Column({ name: 'total', type: 'decimal', nullable: true })
    total: number;
  }
  