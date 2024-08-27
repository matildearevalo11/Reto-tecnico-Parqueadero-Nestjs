import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'token' })
export class Token {

  @PrimaryGeneratedColumn({ name: 'id_token' })
  id: number;

  @Column()
  token: string;

  @Column()
  expiration: Date;
}
