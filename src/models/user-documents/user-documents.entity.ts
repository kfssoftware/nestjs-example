import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { DocumentType, UserType } from 'src/common/enums';
import { User } from '../user/user.entity';

@Entity()
export class UserDocuments extends BaseEntity {

  @Column()
  userId: number;

  @Column({ type: 'text', nullable: true })
  documentUrl: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.Certificates
  })
  public documentType: DocumentType

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.User
  })
  public userType: UserType

  @ManyToOne(() => User, user => user.userDocuments)
  user: User;

}
