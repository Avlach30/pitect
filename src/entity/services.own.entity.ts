import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Services } from './services.entity';
import { Users } from './user.entity';

@Entity('serviceowns')
export class ServiceOwns {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Services) //Reference to service entity
  @JoinColumn()
  serviceId: Services;

  @OneToOne((type) => Users) //Reference to user entity
  @JoinColumn()
  userId: Users;

  @Column()
  ownStatus: string;
}
