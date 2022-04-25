import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Services } from './services.entity';
import { ServiceInfos } from './services.info.entity';
import { Carts } from './cart.entity';

@Entity('cartitems')
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Services, (service) => service.id) //Reference to Services entity
  @JoinColumn()
  serviceId: Services;

  @OneToMany(() => ServiceInfos, (serviceInfo) => serviceInfo.id) //Reference to ServiceInfos entity
  @JoinColumn()
  serviceInfoId: ServiceInfos;

  @ManyToOne(() => Carts, (cart) => cart.id) //Reference to Carts entity
  @JoinColumn()
  cartId: Carts;
}
