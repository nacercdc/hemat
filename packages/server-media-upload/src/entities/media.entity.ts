import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('medias')
@Index(['entityType', 'entityId'])
@Index(['storageType'])
@Index(['mimeType'])
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 'local' })
  storageType: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  contentHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
