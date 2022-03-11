import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  numberPhone: number;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column()
  email: string;

  @Column()
  password: string;
}
