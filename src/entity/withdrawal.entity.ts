import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Users } from './user.entity';
import { Banks } from './bank.entity';

@Entity('withdrawals')
export class Withdrawals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  status: string;

  @Column()
  slipTransfer: string;

  @ManyToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  userId: Users;

  @ManyToOne((type) => Banks) //Reference to Banks entity
  @JoinColumn()
  bankId: Banks;
}
