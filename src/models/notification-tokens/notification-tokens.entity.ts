import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class NotificationTokens extends BaseEntity {

  @Column()
  userId: number;

  @Column({ length: 500 })
  token: string;

  @ManyToOne(() => User, user => user.notificationTokens)
  user: User;
}