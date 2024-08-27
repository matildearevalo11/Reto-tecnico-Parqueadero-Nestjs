import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from '../../users/entities/user.entity'; 
  
  @Entity({ name: 'parking' })
  export class Parking {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
  
    @Column({ name: 'name', nullable: true })
    name: string;
  
    @Column({ name: 'address', nullable: true })
    address: string;
  
    @Column({ name: 'vehicle_capacity', nullable: true })
    vehicleCapacity: number;
  
    @Column({ name: 'hourly_rate', type: 'decimal', nullable: true })
    hourlyRate: number;
  }