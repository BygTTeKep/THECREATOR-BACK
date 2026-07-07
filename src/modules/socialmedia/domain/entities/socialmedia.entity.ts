import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('socialmedia')
export class SocialMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  link: string;
}
