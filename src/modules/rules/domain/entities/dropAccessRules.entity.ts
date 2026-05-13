import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drop_access_rules')
export class DropAccessRulesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'integer', nullable: false })
  drop_id: number;
  @Column({ type: 'integer', nullable: false })
  min_tier_id: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  min_months: number;

  @Column({ type: 'boolean', default: false })
  whitelist_only: boolean;
}
