import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('carts')
export class Carts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  userId: Users;
}