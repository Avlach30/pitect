import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('projects')
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  admin: Users;

  @Column()
  totalContract: number;

  @Column()
  startDate: string;

  @Column()
  finishDate: string;

  @Column()
  address: string;
}
