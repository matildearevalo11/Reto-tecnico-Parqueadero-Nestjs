import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../../roles/role.enum';


@Entity({ name: 'user' })
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
}