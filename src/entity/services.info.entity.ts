import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Services } from './services.entity';

@Entity('serviceinfos')
export class ServiceInfos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  duration: number;

  @Column()
  cost: number;

  @OneToOne((type) => Services) //Reference to service entity
  @JoinColumn()
  serviceId: Services;
}
