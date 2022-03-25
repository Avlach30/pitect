import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Projects } from './project.entity';

@Entity('projectbudgets')
export class ProjectBudgets {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Projects)
  @JoinColumn()
  projectId: Projects;

  @Column()
  date: string;

  @Column()
  content: string;

  @Column()
  amount: string;
}
