import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from './user.entity';
import { Projects } from './project.entity';

@Entity('projectmembers')
export class ProjectMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  user: Users;

  @OneToOne((type) => Projects)
  @JoinColumn()
  projectId: Projects;
}
