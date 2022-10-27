import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserCertificate extends BaseEntity {

  @Column()
  userId: number;

  @Column({ type: 'text', nullable: true })
  certificateUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  confirm: boolean;

  @ManyToOne(() => User, user => user.userDocuments)
  user: User;
}
