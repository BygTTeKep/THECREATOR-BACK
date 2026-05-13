import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drops_files')
export class DropsFilesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'integer', nullable: false })
  drop_id: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  file_url: string;
}
