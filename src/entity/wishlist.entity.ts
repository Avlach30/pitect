import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Users } from './user.entity';
import { Services } from './services.entity';

@Entity('wishlists')
export class Wishlists {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Services, (service) => service.id) //Reference to Services entity
  @JoinColumn()
  serviceId: Services;

  @OneToMany((type) => Users, (user) => user.id) //Reference to Users entity
  @JoinColumn()
  userId: Users;
}
