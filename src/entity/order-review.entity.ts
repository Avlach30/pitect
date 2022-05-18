import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Column,
} from 'typeorm';

import { Services } from './services.entity';
import { Orders } from './order.entity';

@Entity('orderreviews')
export class OrderReviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @ManyToOne(() => Orders, (order) => order.id) //Reference to Orders entity
  @JoinColumn()
  orderId: Orders;

  @OneToMany(() => Services, (service) => service.id) //Reference to Services entity
  @JoinColumn()
  serviceId: Services;
}
