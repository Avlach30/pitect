import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('services')
export class Services {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('boolean', { default: true })
  isService: boolean;

  @Column()
  cost: number;

  @Column()
  category: number;

  @Column()
  image: string;

  @OneToMany((type) => Users, (user) => user.id) //Reference to Users entity
  @JoinColumn()
  creator: Users;
}
