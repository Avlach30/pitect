import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('banks')
export class Banks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  numberAccount: number;

  @ManyToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  userId: Users;
}
