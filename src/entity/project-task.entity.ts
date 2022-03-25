import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Projects } from './project.entity';

@Entity('tasks')
export class ProjectTasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('boolean', { default: false })
  isFinished: boolean;

  @OneToOne((type) => Projects)
  @JoinColumn()
  projectId: Projects;
}
