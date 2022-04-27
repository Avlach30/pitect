import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Services } from './services.entity';
import { ServiceInfos } from './services.info.entity';
import { Orders } from './order.entity';

@Entity('orderitems')
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orders, (order) => order.id) //Reference to Orders entity
  @JoinColumn()
  orderId: Orders;

  @OneToMany(() => Services, (service) => service.id) //Reference to Services entity
  @JoinColumn()
  serviceId: Services;

  @OneToMany(() => ServiceInfos, (serviceInfo) => serviceInfo.id) //Reference to ServiceInfos entity
  @JoinColumn()
  serviceInfoId: ServiceInfos;
}
