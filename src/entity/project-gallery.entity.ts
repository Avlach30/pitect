import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Users } from './user.entity';
import { Projects } from './project.entity';

@Entity('projectgalleries')
export class ProjectGalleries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: string;

  @Column()
  imageUrl: string;

  @ManyToOne((type) => Users) //Reference to Users entity
  @JoinColumn()
  userId: Users;

  @ManyToOne((type) => Projects) //Reference to Projects entity
  @JoinColumn()
  projectId: Projects;
}
