import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('inspirations')
export class Inspirations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  imgaeUrl: string;

  @ManyToOne((type) => Users, (user) => user.id) //Reference to Users entity
  @JoinColumn()
  creator: Users;

  @Column()
  description: string;
}
