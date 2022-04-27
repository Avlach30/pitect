import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Column,
} from 'typeorm';

import { Users } from './user.entity';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  cost: number;

  @Column({ default: 'Belum bayar' })
  status: string;

  @Column({ default: 'Some image' })
  slipPayment: string;

  @OneToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  userId: Users;
}
